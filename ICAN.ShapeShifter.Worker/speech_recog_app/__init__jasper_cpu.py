# Copyright (c) 2019 NVIDIA Corporation
import os

# from app import routes  # noqa
from flask import Flask
from ruamel.yaml import YAML

import nemo
import nemo.collections.asr as nemo_asr
from nemo.utils import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# make sure WORK_DIR exists before calling your service
# in this folder, the service will store received .wav files and constructed
# .json manifests
WORK_DIR = "."
MODEL_YAML = "speech_recog_app/checkpoint/jasper10x5dr.yaml"
CHECKPOINT_ENCODER = "speech_recog_app/checkpoint/JasperEncoder-STEP-265520.pt"
CHECKPOINT_DECODER = "speech_recog_app/checkpoint/JasperDecoderForCTC-STEP-265520.pt"
# Set this to True to enable beam search decoder
ENABLE_NGRAM = False
# This is only necessary if ENABLE_NGRAM = True. Otherwise, set to empty string
LM_PATH = "<PATH_TO_KENLM_BINARY>"

# Read model YAML
yaml = YAML(typ="safe")
with open(MODEL_YAML) as f:
    jasper_model_definition = yaml.load(f)
labels = jasper_model_definition['labels']

# Instantiate necessary Neural Modules
# Note that data layer is missing from here
# neural_factory = nemo.core.NeuralModuleFactory(placement=nemo.core.DeviceType.GPU)
neural_factory = nemo.core.NeuralModuleFactory(placement=nemo.core.DeviceType.CPU)
data_preprocessor = nemo_asr.AudioToMelSpectrogramPreprocessor()
jasper_encoder = nemo_asr.JasperEncoder(
    jasper=jasper_model_definition['JasperEncoder']['jasper'],
    activation=jasper_model_definition['JasperEncoder']['activation'],
    feat_in=jasper_model_definition['AudioToMelSpectrogramPreprocessor']['features'],
)
jasper_encoder.restore_from(CHECKPOINT_ENCODER, local_rank=0)
jasper_decoder = nemo_asr.JasperDecoderForCTC(feat_in=1024, num_classes=len(labels))
jasper_decoder.restore_from(CHECKPOINT_DECODER, local_rank=0)
greedy_decoder = nemo_asr.GreedyCTCDecoder()

if ENABLE_NGRAM and os.path.isfile(LM_PATH):
    beam_search_with_lm = nemo_asr.BeamSearchDecoderWithLM(
        vocab=labels, beam_width=64, alpha=2.0, beta=1.0, lm_path=LM_PATH, num_cpus=max(os.cpu_count(), 1),
    )
else:
    logging.info("Beam search is not enabled")

# if __name__ == '__main__':
#     print("Running __init__ app.run()")
#     app.run()
