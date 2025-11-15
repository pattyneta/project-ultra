# Project Ultra: On-Device AI for Privacy-First Web Apps

Welcome, Operative. This repository contains the briefing materials for **"Project Ultra,"**.

Just as the code-breakers at Bletchley Park performed all critical analysis "on-site" to protect top-secret data, you will learn to build AI applications that run entirely *in the browser*. Your user's sensitive data ("intercepted messages") will never leave their device, guaranteeing 100% privacy.

We will use Google's Gemma3n as our "Ultra Engine" and MediaPipe as our "Bombe" to analyze text data instantly, all with the power of WebGPU.

## 🎯 Mission Objectives

By the end of this briefing, you will be able to:

* **Establish a Secure Station:** Configure the MediaPipe LLM Inference API to run Gemma in a web app.

* **Deploy the 'Ultra' Engine:** Build an "Intelligence Terminal" to get instant, streaming responses from the text model.

* **Activate Specialist 'Huts' (LoRA):** Use LoRA adapters to instantly change your model's specialization, just as different "huts" at Bletchley specialized in different ciphers.

* **Maintain Secrecy:** Prove that all operations are 100% private and perform *zero* network requests during analysis.

## ⚠️ Operative Prerequisites

To ensure mission success, please have the following prepared **before** the session:

### 1. Hardware & Browser

* At least 4GB RAM :D

* **Google Chrome** (latest version) for full WebGPU support.

### 2. Software

* **Node.js** (v18 or higher). We will use `npx` (included with Node.js) to run our local station.


## 🚀 Getting Started: Establish Your Station

1. **Clone or Download this Repo:**
   Create a folder named `project-ultra` for your files from the repo:
   `https://github.com/pattyneta/project-ultra/`

2. **Run Your Local Server:**
   This is **mandatory**. Your "station" cannot operate from a local `file:///` path due to security protocols.

   In your terminal, from the root of the `project-ultra` folder, run:

```
   npx http-server
```

3. **Open The Terminal:**
   Open your Chrome browser and go to the URL shown in your terminal (usually http://127.0.0.1:8080 or http://localhost:8080).

   You should see the "Project Ultra Intelligence Terminal" UI. It's waiting for you to power it up.
