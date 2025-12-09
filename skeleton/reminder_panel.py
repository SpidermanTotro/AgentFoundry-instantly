#!/usr/bin/env python3
"""
Reminder Panel Component

Streamlit component for displaying reminders and notifications.
"""

import streamlit as st
from datetime import datetime, timedelta
from typing import List, Dict, Any


class ReminderPanel:
    """Reminder panel for AgentFoundry development."""
    
    def __init__(self):
        """Initialize reminder panel."""
        self.reminders = self.load_reminders()
    
    def load_reminders(self) -> List[Dict[str, Any]]:
        """Load reminders from session state or defaults."""
        if 'reminders' not in st.session_state:
            st.session_state.reminders = [
                {
                    "id": 1,
                    "title": "Review open PRs",
                    "description": "Check and review pending pull requests",
                    "priority": "high",
                    "due_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
                    "completed": False
                },
                {
                    "id": 2,
                    "title": "Update documentation",
                    "description": "Update README and API docs",
                    "priority": "medium",
                    "due_date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
                    "completed": False
                },
                {
                    "id": 3,
                    "title": "Run security scan",
                    "description": "Execute security vulnerability scan",
                    "priority": "high",
                    "due_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
                    "completed": False
                }
            ]
        return st.session_state.reminders
    
    def render(self):
        """Render the reminder panel."""
        st.subheader("📌 Reminders")
        
        # Filter options
        filter_option = st.selectbox(
            "Filter",
            ["All", "High Priority", "Medium Priority", "Low Priority", "Completed"]
        )
        
        # Filter reminders
        filtered_reminders = self.filter_reminders(filter_option)
        
        if not filtered_reminders:
            st.info("No reminders to display")
            return
        
        # Display reminders
        for reminder in filtered_reminders:
            self.render_reminder(reminder)
        
        # Add new reminder button
        if st.button("➕ Add Reminder"):
            self.show_add_form()
    
    def filter_reminders(self, filter_option: str) -> List[Dict[str, Any]]:
        """Filter reminders based on selected option."""
        if filter_option == "All":
            return [r for r in self.reminders if not r["completed"]]
        elif filter_option == "High Priority":
            return [r for r in self.reminders if r["priority"] == "high" and not r["completed"]]
        elif filter_option == "Medium Priority":
            return [r for r in self.reminders if r["priority"] == "medium" and not r["completed"]]
        elif filter_option == "Low Priority":
            return [r for r in self.reminders if r["priority"] == "low" and not r["completed"]]
        elif filter_option == "Completed":
            return [r for r in self.reminders if r["completed"]]
        return self.reminders
    
    def render_reminder(self, reminder: Dict[str, Any]):
        """Render a single reminder."""
        priority_emoji = {
            "high": "🔴",
            "medium": "🟡",
            "low": "🟢"
        }
        
        with st.container():
            col1, col2, col3 = st.columns([0.1, 0.7, 0.2])
            
            with col1:
                completed = st.checkbox(
                    "",
                    value=reminder["completed"],
                    key=f"reminder_{reminder['id']}"
                )
                if completed != reminder["completed"]:
                    reminder["completed"] = completed
            
            with col2:
                priority = priority_emoji.get(reminder["priority"], "⚪")
                st.markdown(f"{priority} **{reminder['title']}**")
                st.caption(reminder["description"])
            
            with col3:
                st.caption(f"Due: {reminder['due_date']}")
            
            st.divider()
    
    def show_add_form(self):
        """Show form to add new reminder."""
        with st.form("add_reminder_form"):
            st.subheader("Add New Reminder")
            
            title = st.text_input("Title")
            description = st.text_area("Description")
            priority = st.selectbox("Priority", ["high", "medium", "low"])
            due_date = st.date_input("Due Date")
            
            if st.form_submit_button("Add"):
                new_reminder = {
                    "id": len(self.reminders) + 1,
                    "title": title,
                    "description": description,
                    "priority": priority,
                    "due_date": due_date.strftime("%Y-%m-%d"),
                    "completed": False
                }
                self.reminders.append(new_reminder)
                st.session_state.reminders = self.reminders
                st.success("✅ Reminder added!")
                st.rerun()


def main():
    """Standalone reminder panel app."""
    st.set_page_config(page_title="Reminder Panel", page_icon="📌", layout="wide")
    
    st.title("📌 Development Reminders")
    
    panel = ReminderPanel()
    panel.render()


if __name__ == "__main__":
    main()
