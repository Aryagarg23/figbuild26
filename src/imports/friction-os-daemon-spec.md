System Context & Project Goal
You are building Friction, an experimental, biologically-driven operating system daemon that lives inside a web-based "Fake OS" sandbox.
The Fake OS already contains basic, interactive windowed applications: Slack, Notes, Calculator, VS Code (VSC), Mail, and Calendar.
There is also a "Left Panel" with global sliders controlling simulated biometric data: Focus (0-100), Fatigue (0-100), and Engagement (0-100).
Your job is to build the Friction Application and its system-wide interventions based strictly on the specifications below.
Part 1: The Core Layout & Idle State (Right-Side Drawer)
When Friction is NOT in an active work session, it does not exist as a standard window.
The Component: Build a Right-Side Taskbar/Drawer fixed to the right edge of the Fake OS viewport (z-index highest, above Fake OS apps).
Behavior: By default, it is retracted, showing only a thin glowing edge or subtle icon. When the user hovers or clicks this edge, the drawer slides out smoothly to take up roughly 25-30% of the screen width.
Content: When expanded, this drawer houses either Screen 1 (The Terminal/Moon Pool) or Screen 3 (The Mirror/Reflection). The user can toggle between them when idle.
Part 2: Screen 1 - The Terminal (Task Setup & The Moon Pool)
This is where the user visually sets up their cognitive workload before starting a session.
The Visuals: The main UI of the drawer is the "Moon Pool"—a fluid, amorphous canvas (use CSS metaballs or a simple WebGL/Canvas fluid simulation).
Task Ingestion (Drag-and-Drop):
Make elements inside the Fake OS apps (e.g., a mock email in Mail, a block of code in VSC, a message in Slack) draggable.
The user must be able to drag these items from the Fake OS windows and drop them directly into Friction's Moon Pool drawer.
Upon dropping, the item becomes a floating "node" in the pool. The fluid visually thickens or changes color slightly to represent added cognitive weight.
Setting the Time Boundary: The user clicks and drags the physical boundaries of the Moon Pool (or a boundary slider) to set the session duration.
Initiation: A primary action button (e.g., "Immerse") starts the session.
Action: The right drawer completely retracts and disappears. Friction transitions to Screen 2 (The Scaffolding) and takes over the OS.
Part 3: Screen 2 - The Scaffolding (Active Session & Interventions)
Once Immersed, Friction becomes a completely invisible system-wide overlay that intercepts OS interactions based on the global Biometric State (controlled by the Left Panel sliders).
Implement the following 6 conditional sub-states that update in real-time as the sliders change:
State 2.1: Pure Invisibility (Max Focus)
Trigger: Focus > 80%, Fatigue < 40%.
Behavior: The OS functions entirely normally. Friction is invisible, allowing the user to use the Fake OS apps seamlessly.
State 2.2: The Edge-Bump (Task Completion)
Trigger: User needs to mark a task as done while in Max Focus (State 2.1).
Behavior: If the user aggressively moves their mouse to the far right edge of the screen, a minimalist, translucent drawer peeks out containing their active task nodes. The user clicks/swipes a node to complete it, and the drawer instantly snaps back out of sight.
State 2.3: Passive Task Bar (Moderate State)
Trigger: Focus drops to 50% - 80%.
Behavior: A minimalist, low-contrast, pill-shaped floating widget fades in at the top-center of the screen. It displays the name of the current active task (e.g., "Drafting API Logic in VSC"). It is not clickable; it is purely a visual anchor.
State 2.4: Low Focus Pivot (Attention Interventions)
Trigger: Focus < 50% and Fatigue is rising.
Behavior: The entire Fake OS screen receives a CSS backdrop-filter: blur(). A smooth overlay appears offering three non-intrusive intervention bubbles:
Breathe (Triggers a 60s expanding/contracting animation).
Posture (A prompt to stretch).
Audio Shift (Changes mock background track).
Resolution: Clicking one and letting it play out removes the blur and returns the user to the OS.
State 2.5: The Digital Moss (Distraction Return)
Trigger: The user switches away from their primary work app (e.g., VSC), focus drops, and then they click back into the primary app after a delay.
Behavior: The primary app window is overlaid with a "Digital Moss" (use a static stylized moss/fractal PNG or canvas mask for now). Hardcoded keywords representing their last task are visible in the moss.
Interaction: The user must click and drag (swipe) their mouse across the moss to erase it (using a canvas erase/masking effect). Once erased, the words "snap" into the app, and the user regains control.
State 2.6: The Hard Intercept (Burnout)
Trigger: Fatigue > 90%.
Behavior: A heavy, dark radial vignette encroaches from the edges of the screen, reducing the field of view.
Simulated Friction: Apply a setTimeout delay to all keyboard inputs within the Fake OS to simulate heavy, exhausting typing.
Lockout: A brutalist modal drops down: "Cognitive capacity depleted. Physical reset required." The only clickable option is "End Session", which forces the user out of Screen 2.
Part 4: Session Termination & The Handoff
When the timer (set in Screen 1) reaches 0:00, the session evaluates the current state rather than forcing a hard stop.
Condition A (Time Out + High Energy + Tasks Remaining):
Trigger: Timer hits 0:00, Fatigue < 70%, and not all tasks in the Moon Pool are marked done.
Behavior: A non-intrusive, soft notification slides in: "Time boundary reached. You still have capacity. Continue or Reflect?" The user can ignore it and keep working, or click "Reflect" to end the session.
Condition B (Time Out + Tasks Done):
Trigger: Timer hits 0:00 (or earlier if tasks are done).
Behavior: A celebratory, visually warm notification appears, validating the completed work before transitioning the user.
Action on Session End: The Fake OS returns to normal. The Right-Side Drawer slides back out automatically, displaying Screen 3.
Part 5: Screen 3 - The Mirror (Reflection)
This UI lives inside the expanded Right-Side Drawer after a session ends.
The Visuals: Render a vertical "Depth of Field" timeline representing the session that just occurred.
Data Mapping: Do not use numbers or line graphs. Use the historical session data.
Segments of time where Focus was high are rendered in sharp, crisp CSS/Canvas.
Segments where Fatigue was high or Focus was low are rendered using heavy Gaussian blurs.
Interaction: The user's completed tasks are listed. The user drags and drops these tasks onto the visual timeline where they believe they completed them. The UI then gently reveals if their qualitative feeling matches the biometric reality of the timeline.