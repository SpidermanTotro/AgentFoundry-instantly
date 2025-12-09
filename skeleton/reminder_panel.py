#!/usr/bin/env python3
"""
Reminder Panel - Training reminder and scheduling system
"""

import streamlit as st
from datetime import datetime, timedelta

def show():
    """Display reminder panel"""
    
    st.subheader("📅 Training Schedule")
    
    # Upcoming reminders
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("### Upcoming Sessions")
        
        reminders = [
            {"name": "Model Fine-tuning", "date": datetime.now() + timedelta(days=1), "type": "Training"},
            {"name": "Agent Evaluation", "date": datetime.now() + timedelta(days=3), "type": "Testing"},
            {"name": "Performance Review", "date": datetime.now() + timedelta(days=7), "type": "Review"}
        ]
        
        for reminder in reminders:
            with st.expander(f"📌 {reminder['name']} - {reminder['date'].strftime('%Y-%m-%d')}"):
                st.text(f"Type: {reminder['type']}")
                st.text(f"Date: {reminder['date'].strftime('%Y-%m-%d %H:%M')}")
                
                col_a, col_b = st.columns(2)
                with col_a:
                    if st.button("Complete", key=f"complete_{reminder['name']}"):
                        st.success("Marked as complete!")
                with col_b:
                    if st.button("Reschedule", key=f"reschedule_{reminder['name']}"):
                        st.info("Reschedule dialog...")
    
    with col2:
        st.markdown("### Quick Add")
        
        task_name = st.text_input("Task Name", key="new_task")
        task_date = st.date_input("Date", key="new_date")
        task_type = st.selectbox("Type", ["Training", "Testing", "Review"], key="new_type")
        
        if st.button("Add Reminder", use_container_width=True):
            st.success(f"Added: {task_name}")
    
    st.markdown("---")
    
    # Statistics
    st.subheader("📊 Statistics")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Total Sessions", "12")
    
    with col2:
        st.metric("Completed", "8", "+2")
    
    with col3:
        st.metric("Upcoming", "4", "-1")

if __name__ == '__main__':
    show()
