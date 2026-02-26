#!/usr/bin/env python3
"""
DDD Melbourne 2026 - Terminal Agenda Viewer
Saturday 21st February 2026 | Melbourne Town Hall
Source: https://www.dddmelbourne.com/agenda
"""

import os
import sys

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.columns import Columns
from rich.layout import Layout
from rich import box

console = Console()

# ── Conference metadata ──────────────────────────────────────────────
CONF = {
    "name": "DDD Melbourne 2026",
    "date": "Saturday 21st February 2026",
    "venue": "Melbourne Town Hall",
    "website": "https://www.dddmelbourne.com/agenda",
    "tagline": "An inclusive non-profit conference for the Melbourne software community",
}

# ── Room colour mapping (matches website) ────────────────────────────
ROOM_STYLES = {
    "Main Hall":      "bold cyan",
    "Swanston Room":  "bold yellow",
    "Supper Room":    "bold green",
    "Yarra Room":     "bold red",
    "Hoddle Room":    "bold bright_red",
}

# ── Session data ─────────────────────────────────────────────────────
SESSIONS = [
    {
        "id": "keynote",
        "title": "AI: it's our responsibility",
        "speaker": "Sreyna Rath",
        "bio": "CEO & Founder, Jaimee AI",
        "format": "45 min | Keynote",
        "level": "No experience necessary",
        "tags": ["AI", "Leadership", "Professional/soft skills"],
        "abstract": (
            "AI is sexist, racist, and dangerous. And it's on us, the developers building it today, to fix that. "
            "This session focuses on building systems that don't harm people. We'll explore practical frameworks "
            "for ethical AI development, from compassionate design that protects the most vulnerable, to training "
            "out bias, implementing guardrails that actually work, and using AI agents to keep each other in check."
        ),
    },
    {
        "id": "code-conversation",
        "title": "Code is a Conversation: What Are You Really Saying to the Next Developer?",
        "speaker": "Joel Gallagher",
        "bio": "Senior Developer",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["Career", "Leadership", "Professional/soft skills", "Teams"],
        "abstract": (
            "We often treat code as instructions for machines… but in reality, code is a conversation between "
            "developers across time. We'll explore how to write code that communicates clearly, empathetically, "
            "and effectively with real-world examples of confusing vs. clean code."
        ),
    },
    {
        "id": "safety-first",
        "title": "The Safety First App: 12 Product Patterns That Turn Failures into Recoveries",
        "speaker": "Renaldi Gondosubroto",
        "bio": "Director at Cloudetica Solutions",
        "format": "45 min",
        "level": "Mostly intermediate",
        "tags": ["APIs", "Design and UX", "DevOps", "Frontend dev", "Web"],
        "abstract": (
            "This session gives you a field guide of twelve battle-tested patterns that keep customers safe "
            "when things go wrong: undo everywhere, autosave with draft states, guarded destructive actions, "
            "resilient forms, explainable errors, recovery links, partial degradation, idempotent actions, "
            "and customer-facing runbooks."
        ),
    },
    {
        "id": "go-slow",
        "title": "Go Slow and Build Something: Why Speed Kills (Your Community)",
        "speaker": "Gretchen Scott",
        "bio": "Co-Founder @ Kaleida",
        "format": "20 min",
        "level": "No experience necessary",
        "tags": ["Leadership"],
        "abstract": (
            "This talk is a manifesto for slowing down and building something that lasts. We'll explore why "
            "'shipping community' too fast burns everyone out, the difference between followers and real community, "
            "and how going slow actually accelerates outcomes like engagement and retention."
        ),
    },
    {
        "id": "ai-agents-workshop",
        "title": "From Bots to Brains: Patterns for Building Intelligent AI Agents",
        "speaker": "Rakesh Lakshminarayana",
        "bio": "AI Architect, Agile Insights",
        "format": "Workshop (105 min)",
        "level": "Mostly intermediate",
        "tags": ["AI", "Architecture", "Azure"],
        "abstract": (
            "Dive into how to build smart, action-taking AI agents. Explore practical design patterns and their "
            "evolution through real-world examples — from simple use cases to collaborative multi-agent scenarios. "
            "Walk away with the confidence and code to start building your own autonomous AI sidekicks."
        ),
    },
    {
        "id": "testers",
        "title": "Who Tests the Testers? Making and Testing Pipelines",
        "speaker": "Evan Kohilas",
        "bio": "Developer Productivity Advocate",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["DevOps", "Testing", "Tooling"],
        "abstract": (
            "When it comes to changing your pipeline, how sure are you that it works before taking changes live? "
            "We'll showcase tools for testing, creating, and simulating pipelines so you can always be sure "
            "your pipeline changes won't cause any water damage."
        ),
    },
    {
        "id": "burnout",
        "title": "9 Management Habits Quietly Burning Out Your Best Engineers",
        "speaker": "Andrew Murphy",
        "bio": "Helping new and emerging tech leaders — Tech Leaders Launchpad",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["Leadership"],
        "abstract": (
            "Burnout in engineering teams is rarely caused by a single event. Here are 9 persistent, often "
            "overlooked management habits that quietly erode motivation, well-being, and performance — plus "
            "actionable tips to build a healthier, more sustainable engineering culture."
        ),
    },
    {
        "id": "managing-failure",
        "title": "Managing for Failure",
        "speaker": "Amy Norris",
        "bio": "Software Development Supervisor, Dimensional Innovations",
        "format": "45 min",
        "level": "Mostly intermediate",
        "tags": ["Career", "Leadership", "Professional/soft skills"],
        "abstract": (
            "Failure is an important part of growing your team. Without it, creative problem solving stagnates "
            "and learning slows. We'll explore strategies for helping your team feel comfortable with failure, "
            "keeping your boss happy when it happens, and low-stakes ways to introduce failure."
        ),
    },
    {
        "id": "tech-disagreements",
        "title": "You Aren't Always Right: Resolving Technical Disagreements The Easy Way",
        "speaker": "Max Downey Twiss",
        "bio": "Open-source developer and first-year university student",
        "format": "20 min",
        "level": "No experience necessary",
        "tags": ["Leadership", "Professional/soft skills", "Teams"],
        "abstract": (
            "Lessons learned from working in open-source, on teams with flat management structures, "
            "and ragtag bands of misfits. How to bridge gaps in rank, age, language, experience and mindset "
            "to isolate and solve the real issues."
        ),
    },
    {
        "id": "context-engineering",
        "title": "Throw Away The Vibes: Context Engineering Is All You Need",
        "speaker": "Dasith Wijesiriwardena",
        "bio": "Senior Software Engineer @ Microsoft",
        "format": "20 min",
        "level": "Mostly intermediate",
        "tags": ["AI", "Backend dev", "DevOps", "Frontend dev"],
        "abstract": (
            "The real challenge isn't prompt engineering — it's context engineering. This talk explores why "
            "'vibe coding' is fundamentally broken and introduces the constraint-context matrix and Breadcrumb "
            "Protocol for building sustainable human-AI collaboration."
        ),
    },
    {
        "id": "integrations",
        "title": "Beyond the Code: Building Robust Integrations That Work",
        "speaker": "Emad Alashi",
        "bio": "Principal Consultant",
        "format": "20 min",
        "level": "No experience necessary",
        "tags": ["Agile", "APIs", "Architecture", "Automation", "Backend dev", "DevOps"],
        "abstract": (
            "When building integrations, we often jump straight into automation. This session explores common "
            "integration challenges and pitfalls, so that we are in a better position to build successful "
            "integrations that solve the right business needs."
        ),
    },
    {
        "id": "platform-eng",
        "title": "Platform Engineering in the Age of Generative AI",
        "speaker": "Will Velida",
        "bio": "Senior Software Engineer at Microsoft",
        "format": "45 min",
        "level": "Mostly intermediate",
        "tags": ["Cloud", "Containers", "Continuous delivery", "DevOps", "Infrastructure", "Security"],
        "abstract": (
            "We'll explore how platform engineering and generative AI can work together to improve developer "
            "experience, if you get the foundations right. From 'everything-as-code' patterns to AI-assisted "
            "tooling that accelerates platform maturity and reduces friction across teams."
        ),
    },
    {
        "id": "career-refactoring",
        "title": "Refactoring Your Career: From First Commit to Last Pull Request",
        "speaker": "Randi Ratnayake",
        "bio": "Azure Consultant, Developer, Architect, Mentor",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["Career", "Professional/soft skills"],
        "abstract": (
            "Just like the code we write, our careers need refactoring. Whether you're looking for your first "
            "dev role or have been coding for decades: embrace change, invest in timeless skills, and leverage "
            "emerging tools to your advantage."
        ),
    },
    {
        "id": "iac",
        "title": "Dude Where's My State File? Adventures with Infrastructure as Code",
        "speaker": "Kirsty McDonald",
        "bio": "Senior Platform Engineer — Up Bank / Ferocia",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["Architecture", "Automation", "Cloud", "Infrastructure"],
        "abstract": (
            "A deep dive into the dark side of IaC. We'll skip the basics and go straight to real-world "
            "horror stories — anti-patterns that lead to meltdowns and practical solutions to save you from "
            "that dreaded late-night call."
        ),
    },
    {
        "id": "blazor-workshop",
        "title": "Real-Time Magic: Crafting Blazor WebAssembly Apps with SignalR and Fluxor",
        "speaker": "William Liebenberg",
        "bio": "Azure & .NET Consultant at Arinco",
        "format": "Workshop (105 min)",
        "level": "Mostly intermediate",
        "tags": ["APIs", "Backend dev", "Frontend dev", "Web"],
        "abstract": (
            "Create a real-time Shopping List application using Blazor WebAssembly, SignalR, and Fluxor. "
            "We'll set up a .NET 10 ASP.NET WebAPI backend with Minimal APIs and integrate Fluxor for "
            "state management through live coding."
        ),
    },
    {
        "id": "pr-bottleneck",
        "title": "Breaking the PR Review Bottleneck",
        "speaker": "Pavel Oborin",
        "bio": "Senior Software Engineer, 17+ years experience",
        "format": "45 min",
        "level": "Mostly intermediate",
        "tags": ["Agile", "Automation", "Continuous delivery", "Teams"],
        "abstract": (
            "Pull request reviews are often the biggest bottleneck in software delivery. This session explores "
            "proven techniques from leading OSS projects — early design alignment, automated reviewer assignment, "
            "merge automation, and modern workflow patterns."
        ),
    },
    {
        "id": "designed-to-fail",
        "title": "Designed To Fail: Building Resilient Applications",
        "speaker": "Callum Whyte",
        "bio": ".NET Developer, Microsoft MVP",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["Architecture", "Backend dev", "Cloud", "DevOps", "Tooling"],
        "abstract": (
            "We'll walk through designing a resilient, real-world system — from redundancy and circuit breakers "
            "to automated failover. We'll also explore observability via health checks and OpenTelemetry, and "
            "automated tools for stress testing."
        ),
    },
    {
        "id": "internal-platforms",
        "title": "It Takes a Village: How Internal Platforms Let Companies Build Great Products",
        "speaker": "Baani Ahluwalia & Laura Schaufelberger",
        "bio": "Senior PM (Kraken Technologies) & Senior Software Engineer",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["Architecture", "Infrastructure", "Professional/soft skills", "Teams"],
        "abstract": (
            "Platform PMs build the foundations that make everything else possible. This session dives into "
            "what Platform PMs actually do, who they build for, and how they drive impact when their metrics "
            "are two layers removed."
        ),
    },
    {
        "id": "awful-code",
        "title": "How To Write Awful Unmaintainable Code",
        "speaker": "Lachlan Kingsford",
        "bio": "Tech Lead @ Vanguard",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["APIs", "Backend dev", "DevOps", "Testing"],
        "abstract": (
            "A bunch of anti-examples gleaned from things I've witnessed — or committed — to maximize WTFs "
            "per line of code. By intentionally looking at real-world awful code, we'll learn the basics of "
            "writing code you'll actually be able to maintain."
        ),
    },
    {
        "id": "blindspot",
        "title": "The Billion Dollar Blindspot: What Happens When Everyone Thinks Alike",
        "speaker": "Amanda Pitcher",
        "bio": "Capability Lead — Design & Strategy and Software Engineering at Versent",
        "format": "45 min",
        "level": "No experience necessary",
        "tags": ["Leadership", "Professional/soft skills", "Teams"],
        "abstract": (
            "Boeing's 737 MAX crashes killed 346 people — the root cause was a cultural blindspot. "
            "Discover why your most challenging colleague might be your secret weapon, how to identify "
            "groupthink patterns, and strategies for building cognitively diverse teams."
        ),
    },
    {
        "id": "agile-late",
        "title": "Congratulations, You Are Agile. Your Product Is Still Late.",
        "speaker": "Marin Niehues",
        "bio": "Founder & Principal Consultant",
        "format": "45 min",
        "level": "Mostly intermediate",
        "tags": ["Agile", "Leadership"],
        "abstract": (
            "Companies are burning millions on 'Agile transformations' that never end. Teams are drowning "
            "in meetings, sprint boards, and Jira tickets. Customers don't care what framework you use — "
            "they care if you solve their problems."
        ),
    },
    {
        "id": "locknote",
        "title": "Hey LEGO Robot, Grab Me a Coke!",
        "speaker": "Daniel Fang",
        "bio": "AI, Robotics & LEGO Enthusiast — Senior Architect / Microsoft MVP",
        "format": "45 min | Locknote",
        "level": "No experience necessary",
        "tags": ["AI", "Azure", "Cloud", "Web"],
        "abstract": (
            "A real-life adventure through robotics, AI, and pure parent-level determination. From random "
            "plastic chaos to a fully operational LEGO robot agent powered by GPT. Featuring agentic brains, "
            "multi-agent orchestration, and a GenAI app that lets you talk to the robot in plain English."
        ),
    },
]

# ── Timetable grid ───────────────────────────────────────────────────
TIMETABLE = [
    ("08:00", "all",      "Registration", None, None, None, None),
    ("08:45", "all",      "Welcome & Housekeeping", None, None, None, None),
    ("09:00", "keynote",  "keynote", None, None, None, None),
    ("09:45", "break",    "Morning Tea ☕", None, None, None, None),
    # (time, type, main_hall, swanston, supper, yarra, hoddle)
    ("10:15", "sessions", "Sponsor Hall + Networking", "code-conversation", "safety-first", "go-slow", "ai-agents-workshop"),
    ("11:00", "break",    "Changeover", None, None, None, None),
    ("11:15", "sessions", "Sponsor Hall + Networking", "testers", "burnout", "managing-failure", "ai-agents-workshop"),
    ("12:00", "break",    "Changeover", None, None, None, None),
    ("12:15", "sessions", "Sponsor Hall + Networking", "tech-disagreements", "context-engineering", "integrations", None),
    ("12:35", "break",    "Lunch 🍽️", None, None, None, None),
    ("13:30", "sessions", "Sponsor Hall + Networking", "platform-eng", "career-refactoring", "iac", "blazor-workshop"),
    ("14:15", "break",    "Changeover", None, None, None, None),
    ("14:30", "sessions", "Sponsor Hall + Networking", "pr-bottleneck", "designed-to-fail", "internal-platforms", "blazor-workshop"),
    ("15:15", "break",    "Afternoon Tea 🍰", None, None, None, None),
    ("15:45", "sessions", "Sponsor Hall + Networking", "awful-code", "blindspot", "agile-late", None),
    ("16:30", "break",    "Changeover", None, None, None, None),
    ("16:45", "locknote", "locknote", None, None, None, None),
    ("17:30", "all",      "Closing", None, None, None, None),
    ("18:00", "party",    "Afterparty 🎉 — Beer Deluxe, Federation Square", None, None, None, None),
]

DURATIONS = {
    "10:15": "45 min", "11:15": "45 min", "12:15": "20 min",
    "13:30": "45 min", "14:30": "45 min", "15:45": "45 min",
    "09:00": "45 min", "16:45": "45 min",
}

SPONSORS = {
    "Diamond": ["Pinch"],
    "Platinum": ["Octopus Deploy", "Netwealth"],
    "Gold": ["Microsoft", "Umbraco", "Twilio", "Fabric Group", "BuildKite", "Vercel"],
    "Silver": ["Stile Education", "NDC Sydney", "AWS"],
    "Wi-Fi": ["Luminary"],
    "Networking Breakfast": ["Kaleida"],
    "Childcare": ["Non Zero Sum"],
    "Coffee Cart": ["Drawboard", "REAGroup"],
}

# ── Helper to look up session by id ─────────────────────────────────
def get_session(sid):
    for s in SESSIONS:
        if s["id"] == sid:
            return s
    return None


# ── Render: Header ───────────────────────────────────────────────────
def render_header():
    title = Text()
    title.append("╔══════════════════════════════════════════════════════════════════════════════╗\n", style="bold magenta")
    title.append("║", style="bold magenta")
    title.append("                        DDD MELBOURNE 2026                                 ", style="bold white on magenta")
    title.append("║\n", style="bold magenta")
    title.append("║", style="bold magenta")
    title.append("              Saturday 21st February • Melbourne Town Hall                  ", style="bold white on magenta")
    title.append("║\n", style="bold magenta")
    title.append("║", style="bold magenta")
    title.append("   An inclusive non-profit conference for the Melbourne software community  ", style="italic white on magenta")
    title.append("║\n", style="bold magenta")
    title.append("╚══════════════════════════════════════════════════════════════════════════════╝", style="bold magenta")
    console.print(title)
    console.print()


# ── Render: Full timetable grid ──────────────────────────────────────
def render_timetable():
    table = Table(
        title="📅  FULL DAY AGENDA",
        box=box.DOUBLE_EDGE,
        show_lines=True,
        title_style="bold white",
        border_style="bright_black",
        expand=True,
        padding=(0, 1),
    )
    table.add_column("Time", style="bold magenta", width=7, justify="center")
    table.add_column("Main Hall", style="cyan", ratio=1)
    table.add_column("Swanston", style="yellow", ratio=1)
    table.add_column("Supper", style="green", ratio=1)
    table.add_column("Yarra", style="red", ratio=1)
    table.add_column("Hoddle", style="bright_red", ratio=1)

    prev_hoddle_workshop = None
    for row in TIMETABLE:
        time, rtype, col1, col2, col3, col4, col5 = row
        dur = DURATIONS.get(time, "")
        time_str = f"{time}\n{dur}" if dur else time

        if rtype in ("all", "break", "party"):
            label = col1
            style = "bold white on blue" if rtype == "break" else ("bold white on bright_magenta" if rtype == "party" else "bold")
            table.add_row(time_str, f"[{style}]{label}[/]", "", "", "", "", style="dim" if rtype == "break" else None)
        elif rtype == "keynote":
            s = get_session(col1)
            label = f"[bold]🎤 KEYNOTE: {s['speaker']}[/bold]\n[italic]{s['title']}[/italic]"
            table.add_row(time_str, label, "←", "←", "←", "←")
        elif rtype == "locknote":
            s = get_session(col1)
            label = f"[bold]🔒 LOCKNOTE: {s['speaker']}[/bold]\n[italic]{s['title']}[/italic]"
            table.add_row(time_str, label, "←", "←", "←", "←")
        elif rtype == "sessions":
            cells = []
            cells.append(f"[dim]{col1}[/dim]")
            for sid in (col2, col3, col4, col5):
                if sid is None:
                    cells.append("[dim]—[/dim]")
                else:
                    s = get_session(sid)
                    if s:
                        workshop = " 🔧" if "Workshop" in s["format"] else ""
                        if sid == prev_hoddle_workshop and cells == cells:
                            pass  # will handle below
                        cells.append(f"[bold]{s['speaker']}[/bold]\n[italic]{s['title'][:60]}{'…' if len(s['title'])>60 else ''}[/italic]{workshop}")
                    else:
                        cells.append("[dim]—[/dim]")
            table.add_row(time_str, *cells)
        else:
            table.add_row(time_str, col1 or "", col2 or "", col3 or "", col4 or "", col5 or "")

    console.print(table)
    console.print()


# ── Render: Detailed session cards ───────────────────────────────────
def render_session_detail(s, room=None, time=None):
    header = Text()
    header.append(f"  {s['title']}  ", style="bold white")

    meta_parts = []
    if time:
        meta_parts.append(f"🕐 {time}")
    if room:
        meta_parts.append(f"📍 {room}")
    meta_parts.append(f"⏱  {s['format']}")
    meta_parts.append(f"📊 {s['level']}")
    meta = " │ ".join(meta_parts)

    tags_str = "  ".join(f"[magenta]#{t}[/magenta]" for t in s["tags"])

    content = (
        f"[bold bright_white]🎙  {s['speaker']}[/bold bright_white]\n"
        f"[dim]{s['bio']}[/dim]\n\n"
        f"{meta}\n\n"
        f"{s['abstract']}\n\n"
        f"{tags_str}"
    )

    panel = Panel(
        content,
        title=f" {s['title']} ",
        title_align="left",
        border_style="bright_magenta",
        padding=(1, 2),
        expand=True,
    )
    console.print(panel)


# ── Render: Session list by timeslot ─────────────────────────────────
def render_all_sessions():
    console.print()
    console.rule("[bold bright_white]📋  DETAILED SESSION GUIDE[/]", style="magenta")
    console.print()

    schedule = [
        ("09:00", "Main Hall", ["keynote"]),
        ("10:15", None, [
            ("Swanston Room", "code-conversation"),
            ("Supper Room", "safety-first"),
            ("Yarra Room", "go-slow"),
            ("Hoddle Room", "ai-agents-workshop"),
        ]),
        ("11:15", None, [
            ("Swanston Room", "testers"),
            ("Supper Room", "burnout"),
            ("Yarra Room", "managing-failure"),
        ]),
        ("12:15", None, [
            ("Swanston Room", "tech-disagreements"),
            ("Supper Room", "context-engineering"),
            ("Yarra Room", "integrations"),
        ]),
        ("13:30", None, [
            ("Swanston Room", "platform-eng"),
            ("Supper Room", "career-refactoring"),
            ("Yarra Room", "iac"),
            ("Hoddle Room", "blazor-workshop"),
        ]),
        ("14:30", None, [
            ("Swanston Room", "pr-bottleneck"),
            ("Supper Room", "designed-to-fail"),
            ("Yarra Room", "internal-platforms"),
        ]),
        ("15:45", None, [
            ("Swanston Room", "awful-code"),
            ("Supper Room", "blindspot"),
            ("Yarra Room", "agile-late"),
        ]),
        ("16:45", "Main Hall", ["locknote"]),
    ]

    for slot in schedule:
        time = slot[0]
        dur = DURATIONS.get(time, "")
        console.rule(f"[bold bright_cyan]  ⏰  {time}  ({dur})  [/]", style="cyan")
        console.print()

        if isinstance(slot[2][0], str):
            # single session (keynote/locknote)
            room = slot[1]
            for sid in slot[2]:
                s = get_session(sid)
                if s:
                    render_session_detail(s, room, time)
        else:
            for room, sid in slot[2]:
                s = get_session(sid)
                if s:
                    render_session_detail(s, room, time)
        console.print()


# ── Render: Sponsors ─────────────────────────────────────────────────
def render_sponsors():
    console.print()
    console.rule("[bold bright_white]💎  SPONSORS[/]", style="magenta")
    console.print()

    for tier, names in SPONSORS.items():
        style_map = {
            "Diamond": "bold bright_cyan",
            "Platinum": "bold white",
            "Gold": "bold yellow",
            "Silver": "dim white",
        }
        style = style_map.get(tier, "white")
        names_str = "  •  ".join(names)
        console.print(f"  [{style}]◆ {tier}:[/] {names_str}")

    console.print()


# ── Render: Quick reference ──────────────────────────────────────────
def render_quick_ref():
    table = Table(
        title="🗺️  ROOM LEGEND",
        box=box.ROUNDED,
        border_style="bright_black",
        show_lines=False,
        padding=(0, 2),
    )
    table.add_column("Room", style="bold")
    table.add_column("Colour", style="bold")
    table.add_column("Notes")

    table.add_row("[cyan]Main Hall[/]",     "🟦 Blue",    "Keynote, Locknote, Sponsor Hall")
    table.add_row("[yellow]Swanston Room[/]", "🟨 Yellow",  "Regular sessions")
    table.add_row("[green]Supper Room[/]",    "🟩 Green",   "Regular sessions")
    table.add_row("[red]Yarra Room[/]",       "🟥 Red",     "Regular sessions")
    table.add_row("[bright_red]Hoddle Room[/]", "🟧 Orange", "Workshops (105 min)")

    console.print(table)
    console.print()


# ── Main ─────────────────────────────────────────────────────────────
def main():
    mode = "full"
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()

    console.clear()
    render_header()

    if mode == "grid":
        render_quick_ref()
        render_timetable()
    elif mode == "sessions":
        render_all_sessions()
    elif mode == "sponsors":
        render_sponsors()
    elif mode == "help":
        console.print(Panel(
            "[bold]Usage:[/] python ddd_agenda.py [bold cyan][mode][/]\n\n"
            "  [bold cyan]full[/]       Show everything (default)\n"
            "  [bold cyan]grid[/]       Timetable grid only\n"
            "  [bold cyan]sessions[/]   Detailed session cards\n"
            "  [bold cyan]sponsors[/]   Sponsor list\n"
            "  [bold cyan]help[/]       This help message\n\n"
            f"[dim]Source: {CONF['website']}[/]",
            title="DDD Melbourne 2026 — Terminal Agenda",
            border_style="magenta",
        ))
    else:
        # Full mode
        render_quick_ref()
        render_timetable()
        render_all_sessions()
        render_sponsors()

    console.print(f"[dim]Data sourced from {CONF['website']}[/dim]")
    console.print()


if __name__ == "__main__":
    main()
