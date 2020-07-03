import streamlit as st
import time
import json
from pylxd import Client
from sys import platform
import psutil
import os
import subprocess
import signal

client = None
if platform != "win32":
    # Assume we can connect to lxd in localhost
    client = Client()

processes = {}

def queryState():
    global client

    data = ''
    with open('state.json') as f:
        data = f.read()
    jdata = json.loads(data)

    if client is not None:
        for el in client.containers.all():
            ip = []

            if el.state().network is not None:
                for networkCard in el.state().network:
                    ip.extend([data['address'] for data in el.state().network[networkCard]['addresses']])

            name = el.name
            running = el.status

            if name in jdata:
                jdata[name] = {
                    "running": running,
                    "name": name,
                    "type": "container",
                    "ip": ip
                }

                print(jdata[name])

    for k in jdata:
        if jdata[k]['type'] == "process":
            jdata[k]['running'] = psutil.pid_exists(jdata[k]['pid'])

    return jdata

def startContainer(name):
    global client

    for el in client.containers.all():
        if el.name == name:
            el.start()


def stopContainer(name):
    global client
    
    for el in client.containers.all():
        if el.name == name:
            el.stop()


def startProcess(cmd):
    global processes
    p = subprocess.Popen(cmd)
    print(p)

    processes[p.pid] = p

    return p.pid

def stopProcess(pid):
    global processes
    try:
        p = psutil.Process(pid)
        p.terminate()
    except:
        pass

    if pid in processes:
        processes[pid].terminate()


st.title("ICAN.ShapeShifter.Launcher")
st.button("Refresh")

state = queryState()

print("\n\n")

st.markdown("### Processes")

for el in state:
    if state[el]["type"] == "process":
        st.write("> **" + state[el]["name"] + "**: isAlive(", state[el]["running"], "), last pid", state[el]["pid"])
        start = st.button('> Start ' + state[el]["id"])
        print(start)
        if start:
            state[el]['pid'] = startProcess(state[el]["cmd"])
            st.write("Starting, click Refresh")
        stop = st.button('Stop ' + state[el]["id"])
        print(stop)
        if stop:
            stopProcess(state[el]["pid"])
            st.write("Stopping, click Refresh")

st.markdown("### Containers")

for el in state:
    if state[el]["type"] == "container":
        if state[el]["running"] == 'Running':
            st.write("> **" + state[el]["name"] + "**: Running, ip", ', '.join(state[el]["ip"]))
        else:
            st.write("> **" + state[el]["name"] + "**: ", state[el]["running"])
        start = st.button('> Start ' + state[el]["name"])
        print(start)
        if start:
            startContainer(state[el]["name"])
            st.write("Starting, click Refresh")
        stop = st.button('Stop ' + state[el]["name"])
        print(stop)
        if stop:
            stopContainer(state[el]["name"])
            st.write("Stopping, click Refresh")


with open('state.json', 'w') as f:
    f.write(json.dumps(state, indent=True))

