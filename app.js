// Import from the @mediapipe/tasks-genai module
import { FilesetResolver, LlmInference } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai";

// --- 1. DOM Element Selectors ---
const chatOutput = document.getElementById('chat-output');
const promptInput = document.getElementById('prompt-input');
const sendButton = document.getElementById('send-button');
const adapterSelect = document.getElementById('adapter-select');
// Image selectors REMOVED
const statusLight = document.getElementById('status-light');
const statusText = document.getElementById('status-text');

// --- 2. State Variables ---
let llmInference;

// --- 3. Model & API Configuration ---
const textModelPath = './models/gemma-3n-E2B-it-int4-Web.litertlm';

const loraPaths = {
    "hut-8": "./models/hut-8-adapter.bin",
    "hut-6": "./models/hut-6-adapter.bin"  
};

// --- 4. Core Functions ---

/**
 * Initializes the LLM model
 */
async function initLlm() {
    console.log("[Initializing 'Ultra' Engine...]");
    addMessageToChat("[System booting...]", "system-message");
    updateStatus("BOOTING...", false);

    try {
        // 1. Create the FilesetResolver
        const filesetResolver = await FilesetResolver.forGenAiTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
        );
        
        // 2. Create the text-only model using the resolver
        addMessageToChat("[Loading Text Engine...]", "system-message");
        
        llmInference = await LlmInference.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: textModelPath
            },
            maxTokens: 1024,  // Max tokens for input AND output
            temperature: 0.7, // Controls randomness. 0.0 = deterministic
            topK: 40          // Narrows the model's choices
        });
        addMessageToChat("[Text Engine ONLINE]", "system-ready");

        // 3. All systems go
        updateStatus("ONLINE", true);
        addMessageToChat("[Project Ultra is operational. Awaiting input.]", "system-ready");
        promptInput.disabled = false;
        sendButton.disabled = false;
        adapterSelect.disabled = false; // Enable adapter selection

    } catch (error) {
        console.error("Error initializing LLM:", error);
        updateStatus("SYSTEM FAILURE", false);
        addMessageToChat(`[FATAL ERROR: ${error.message}]`, "system-message");
    }
}

/**
 * Handles sending the prompt to the model
 */
async function handleSend() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        addMessageToChat("[No prompt. Operation cancelled.]", "system-message");
        return;
    }

    addMessageToChat(`[USER]: ${prompt}`, "user-prompt");
    promptInput.value = '';
    sendButton.disabled = true;
    promptInput.disabled = true;

    let engine = llmInference;
    let request = prompt;

    // --- Callback Method ---
    let responseChunk = "";
    const p = document.createElement('p');
    p.className = 'model-response';
    p.textContent = "[MODEL]: "; // Initial text
    chatOutput.appendChild(p);
    chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll

    try {
        await engine.generateResponse(request, (partialResponse, done) => {
            responseChunk += partialResponse;
            // Update the text content of the *same* paragraph element
            p.textContent = `[MODEL]: ${responseChunk}`;
            chatOutput.scrollTop = chatOutput.scrollHeight;

            // When streaming is done, re-enable UI
            if (done) {
                console.log("Response complete.");
                sendButton.disabled = false;
                promptInput.disabled = false;
                promptInput.focus();
            }
        });
    } catch (error) {
        console.error("Error during model inference:", error);
        addMessageToChat(`[INFERENCE ERROR: ${error.message}]`, "system-message");
        // Re-enable UI even on error
        sendButton.disabled = false;
        promptInput.disabled = false;
    }
    // --- End of Callback Method ---
}

/**
 * Applies or resets LoRA adapters
 */
async function handleAdapterChange() {
    const selection = adapterSelect.value;
    
    if (!llmInference || !filesetResolver) {
        addMessageToChat("[Engine offline. Cannot change adapter.]", "system-message");
        return;
    }

    sendButton.disabled = true;
    promptInput.disabled = true;
    addMessageToChat(`[Applying adapter: ${selection}...]`, "system-message");

    try {
        // 1. Close the current model
        await llmInference.close();

        // 2. Define the base options
        const options = {
            baseOptions: {
              modelAssetPath: textModelPath
            },
            maxTokens: 1024,
            temperature: 0.7,
            topK: 40
        };

        // 3. Add LoRA path if selected
        if (selection === "default") {
            addMessageToChat("[Adapter reset to DEFAULT]", "system-ready");
            // No LoRA path is added to options
        } else {
            const loraPath = loraPaths[selection];
            if (!loraPath) {
                throw new Error(`Adapter path for ${selection} not found.`);
            }
            options.loraModelAssetPath = loraPath; // Add the LoRA path
            addMessageToChat(`[${selection.toUpperCase()} adapter ONLINE]`, "system-ready");
        }
        
        // 4. Re-create the llmInference instance
        llmInference = await LlmInference.createFromOptions(filesetResolver, options);

    } catch (error) {
        console.error("Error applying LoRA:", error);
        addMessageToChat(`[ADAPTER ERROR: ${error.message}]`, "system-message");
        // We don't need to reset the dropdown,
        // as the *previous* model state is still what's active if creation failed.
    }

    sendButton.disabled = false;
    promptInput.disabled = false;
}

/**
 * Utility function to update the terminal's status
 */
function updateStatus(message, isOnline) {
    statusText.textContent = message;
    statusLight.className = isOnline ? 'online' : 'offline';
}

/**
 * Utility function to add messages to the chat output
 */
function addMessageToChat(text, sender) {
    const p = document.createElement('p');
    p.className = sender; // 'user-prompt', 'model-response', 'system-message'
    p.textContent = text;
    chatOutput.appendChild(p);
    chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll
}


// --- 5. Event Listeners ---
sendButton.addEventListener('click', handleSend);

promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent new line
        handleSend();
    }
});

adapterSelect.addEventListener('change', handleAdapterChange);
document.addEventListener('DOMContentLoaded', initLlm);