#!/usr/bin/env python3
"""
Web Agent App - Streamlit-based agent manager and development lab

Provides:
- Agent manager
- Assistant interface
- Training tools
- Reminder panel
"""

import streamlit as st
import os
import json
from pathlib import Path
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Agent Development Lab",
    page_icon="🤖",
    layout="wide"
)

# Initialize session state
if 'agents' not in st.session_state:
    st.session_state.agents = []
if 'messages' not in st.session_state:
    st.session_state.messages = []

def load_agents():
    """Load available agents"""
    agents_dir = Path("agents")
    if not agents_dir.exists():
        return []
    
    agents = []
    for agent_file in agents_dir.glob("*.py"):
        agents.append({
            'name': agent_file.stem,
            'path': str(agent_file),
            'size': agent_file.stat().st_size
        })
    return agents

def main():
    """Main application"""
    
    # Sidebar
    with st.sidebar:
        st.title("🤖 Agent Lab")
        st.markdown("---")
        
        menu = st.radio(
            "Navigation",
            ["Agent Manager", "Assistant", "Training", "Reminders"]
        )
        
        st.markdown("---")
        st.caption("Agent Development Lab v0.1.0")
    
    # Main content
    if menu == "Agent Manager":
        show_agent_manager()
    elif menu == "Assistant":
        show_assistant()
    elif menu == "Training":
        show_training()
    elif menu == "Reminders":
        show_reminders()

def show_agent_manager():
    """Agent manager interface"""
    st.title("Agent Manager")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("Available Agents")
        
        agents = load_agents()
        
        if agents:
            for agent in agents:
                with st.expander(f"🤖 {agent['name']}"):
                    st.text(f"Path: {agent['path']}")
                    st.text(f"Size: {agent['size']} bytes")
                    
                    col_a, col_b, col_c = st.columns(3)
                    with col_a:
                        if st.button(f"Run", key=f"run_{agent['name']}"):
                            st.info(f"Running {agent['name']}...")
                    with col_b:
                        if st.button(f"Edit", key=f"edit_{agent['name']}"):
                            st.info(f"Edit {agent['name']} in your IDE")
                    with col_c:
                        if st.button(f"Delete", key=f"delete_{agent['name']}"):
                            st.warning(f"Delete {agent['name']}?")
        else:
            st.info("No agents found. Create one using Dev Copilot!")
    
    with col2:
        st.subheader("Quick Actions")
        
        if st.button("🆕 New Agent", use_container_width=True):
            st.session_state.create_agent = True
        
        if st.button("📦 Package Agents", use_container_width=True):
            st.info("Packaging agents...")
        
        if st.button("🔄 Refresh", use_container_width=True):
            st.rerun()
        
        if st.session_state.get('create_agent'):
            st.markdown("---")
            st.subheader("Create New Agent")
            
            agent_name = st.text_input("Agent Name")
            template = st.selectbox("Template", ["agent_stub", "custom"])
            
            if st.button("Create"):
                st.success(f"Created agent: {agent_name}")
                st.session_state.create_agent = False

def show_assistant():
    """AI assistant interface"""
    st.title("AI Assistant")
    
    st.info("💡 Local LLM is disabled by default. Enable in .devcopilot/config.json")
    
    # Chat interface
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Input
    if prompt := st.chat_input("Ask me anything..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Simulate response
        response = "This is a placeholder response. Enable local LLM for real responses."
        
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        with st.chat_message("assistant"):
            st.markdown(response)

def show_training():
    """Training interface"""
    st.title("Agent Training")
    
    st.subheader("Training Configuration")
    
    col1, col2 = st.columns(2)
    
    with col1:
        agent_select = st.selectbox("Select Agent", ["agent_1", "agent_2", "custom"])
        dataset = st.file_uploader("Upload Training Data", type=['json', 'csv'])
        epochs = st.slider("Epochs", 1, 100, 10)
    
    with col2:
        learning_rate = st.number_input("Learning Rate", value=0.001, format="%.6f")
        batch_size = st.number_input("Batch Size", value=32, step=1)
        validation_split = st.slider("Validation Split", 0.0, 0.5, 0.2)
    
    if st.button("Start Training", type="primary"):
        with st.spinner("Training in progress..."):
            progress_bar = st.progress(0)
            for i in range(100):
                progress_bar.progress(i + 1)
            st.success("Training complete!")

def show_reminders():
    """Reminder panel"""
    st.title("Training Reminders")
    
    import reminder_panel
    reminder_panel.show()

if __name__ == '__main__':
    main()
