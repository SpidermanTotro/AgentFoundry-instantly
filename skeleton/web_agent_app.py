#!/usr/bin/env python3
"""
Streamlit Web Agent Development Lab

Interactive web interface for developing, testing, and training AgentFoundry agents.
"""

import streamlit as st
import json
import os
from pathlib import Path
from datetime import datetime
import subprocess
import sys

st.set_page_config(
    page_title="AgentFoundry Dev Lab",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Title and description
st.title("🤖 AgentFoundry Development Lab")
st.markdown("Interactive agent development and testing environment")

# Sidebar navigation
st.sidebar.title("Navigation")
page = st.sidebar.radio(
    "Go to",
    ["Agent Scaffold", "Template Manager", "Test Runner", "Config Editor", "Training Lab"]
)

# Agent Scaffold Page
if page == "Agent Scaffold":
    st.header("🏗️ Agent Scaffold")
    st.markdown("Generate a new agent with all necessary boilerplate")
    
    col1, col2 = st.columns(2)
    
    with col1:
        agent_name = st.text_input(
            "Agent Name",
            placeholder="my_awesome_agent",
            help="Use snake_case for agent names"
        )
        
        agent_type = st.selectbox(
            "Agent Type",
            ["default", "conversational", "task_executor", "data_processor"]
        )
    
    with col2:
        output_dir = st.text_input(
            "Output Directory",
            value="generated",
            help="Where to save generated files"
        )
    
    if st.button("🚀 Generate Agent", type="primary"):
        if agent_name:
            with st.spinner("Generating agent..."):
                try:
                    cmd = [
                        sys.executable,
                        "skeleton/dev_copilot.py",
                        "--config", "skeleton/.devcopilot/config.json",
                        "scaffold",
                        agent_name,
                        "--type", agent_type
                    ]
                    result = subprocess.run(cmd, capture_output=True, text=True)
                    
                    if result.returncode == 0:
                        st.success(f"✅ Successfully generated agent: {agent_name}")
                        st.code(result.stdout, language="text")
                    else:
                        st.error("❌ Error generating agent")
                        st.code(result.stderr, language="text")
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
        else:
            st.warning("⚠️ Please enter an agent name")

# Template Manager Page
elif page == "Template Manager":
    st.header("📋 Template Manager")
    st.markdown("Browse and manage code generation templates")
    
    template_dir = Path("skeleton/dev_copilot_templates")
    
    if template_dir.exists():
        templates = list(template_dir.glob("*.py"))
        
        if templates:
            st.subheader(f"Available Templates ({len(templates)})")
            
            for template in sorted(templates):
                with st.expander(f"📄 {template.name}"):
                    with open(template, 'r') as f:
                        content = f.read()
                    st.code(content, language="python")
        else:
            st.info("No templates found")
    else:
        st.warning("Template directory not found")

# Test Runner Page
elif page == "Test Runner":
    st.header("🧪 Test Runner")
    st.markdown("Run tests and view results")
    
    test_type = st.selectbox(
        "Test Type",
        ["All Tests", "Unit Tests", "Integration Tests", "Linting"]
    )
    
    if st.button("▶️ Run Tests", type="primary"):
        with st.spinner("Running tests..."):
            try:
                if test_type == "All Tests":
                    cmd = ["bash", "skeleton/run_tests.sh"]
                elif test_type == "Unit Tests":
                    cmd = [sys.executable, "-m", "pytest", "tests/unit", "-v"]
                elif test_type == "Integration Tests":
                    cmd = [sys.executable, "-m", "pytest", "tests/integration", "-v"]
                else:  # Linting
                    cmd = [sys.executable, "-m", "flake8", "skeleton/"]
                
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                
                st.subheader("Test Results")
                if result.returncode == 0:
                    st.success("✅ All tests passed!")
                else:
                    st.error("❌ Some tests failed")
                
                if result.stdout:
                    st.code(result.stdout, language="text")
                if result.stderr:
                    st.code(result.stderr, language="text")
                    
            except subprocess.TimeoutExpired:
                st.error("❌ Tests timed out")
            except Exception as e:
                st.error(f"❌ Error running tests: {str(e)}")

# Config Editor Page
elif page == "Config Editor":
    st.header("⚙️ Configuration Editor")
    st.markdown("Edit Dev Copilot configuration")
    
    config_path = Path("skeleton/.devcopilot/config.json")
    
    if config_path.exists():
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        st.subheader("Current Configuration")
        
        # Editable fields
        config["enable_local_llm"] = st.checkbox(
            "Enable Local LLM",
            value=config.get("enable_local_llm", False),
            help="Enable local language model (requires additional setup)"
        )
        
        config["offline_mode"] = st.checkbox(
            "Offline Mode",
            value=config.get("offline_mode", True),
            help="Work without internet connectivity"
        )
        
        config["temperature"] = st.slider(
            "Temperature",
            min_value=0.0,
            max_value=2.0,
            value=config.get("temperature", 0.7),
            step=0.1,
            help="Creativity level for LLM generation"
        )
        
        # Display full config
        st.subheader("Full Configuration (JSON)")
        edited_config = st.text_area(
            "Edit JSON",
            value=json.dumps(config, indent=2),
            height=400
        )
        
        if st.button("💾 Save Configuration", type="primary"):
            try:
                new_config = json.loads(edited_config)
                with open(config_path, 'w') as f:
                    json.dump(new_config, f, indent=2)
                st.success("✅ Configuration saved!")
            except json.JSONDecodeError as e:
                st.error(f"❌ Invalid JSON: {str(e)}")
            except Exception as e:
                st.error(f"❌ Error saving: {str(e)}")
    else:
        st.warning("Config file not found")

# Training Lab Page
elif page == "Training Lab":
    st.header("🎓 Agent Training Lab")
    st.markdown("Train and fine-tune agents")
    
    st.info("🚧 Training features coming soon!")
    
    st.subheader("Training Options")
    
    training_type = st.selectbox(
        "Training Type",
        ["Supervised Learning", "Reinforcement Learning", "Transfer Learning"]
    )
    
    epochs = st.number_input("Epochs", min_value=1, max_value=1000, value=10)
    batch_size = st.number_input("Batch Size", min_value=1, max_value=128, value=32)
    learning_rate = st.number_input("Learning Rate", min_value=0.0001, max_value=1.0, value=0.001, format="%.4f")
    
    if st.button("🎯 Start Training", type="primary"):
        st.warning("Training functionality will be implemented in train_agent.py")

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("### 📚 Resources")
st.sidebar.markdown("- [README](skeleton/README.md)")
st.sidebar.markdown("- [Automation Guide](skeleton/AUTOMATION_README.md)")
st.sidebar.markdown("- [Migration Guide](skeleton/MIGRATION_GUIDE.md)")
st.sidebar.markdown("- [Contributing](skeleton/CONTRIBUTING.md)")

st.sidebar.markdown("---")
st.sidebar.info(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
