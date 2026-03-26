#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
GIF_PATH = ASSETS / 'terminal-demo.gif'
POSTER_PATH = ASSETS / 'terminal-demo-poster.png'

WIDTH = 1280
HEIGHT = 760
MARGIN = 48
BG = '#F3EBDD'
PANEL = '#111111'
TITLEBAR = '#141414'
TERMINAL = '#181818'
ACCENT = '#C86A3E'
CREAM = '#F3EBDD'
SAND = '#DDB892'
MUTED = '#BFA48B'
GREEN = '#87C38F'
BLUE = '#8DB9D9'
RED = '#E27D60'

FONT_MONO = '/System/Library/Fonts/Menlo.ttc'
FONT_SERIF_BOLD = '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf'
MONO_18 = ImageFont.truetype(FONT_MONO, 18)
MONO_20 = ImageFont.truetype(FONT_MONO, 20)
MONO_24 = ImageFont.truetype(FONT_MONO, 24)
MONO_28 = ImageFont.truetype(FONT_MONO, 28)
SERIF_26 = ImageFont.truetype(FONT_SERIF_BOLD, 26)
SERIF_30 = ImageFont.truetype(FONT_SERIF_BOLD, 30)
SERIF_36 = ImageFont.truetype(FONT_SERIF_BOLD, 36)

LINE_HEIGHT = 32
CONTENT_X = 98
SCENE_Y = 104
CONTENT_Y = 152
CONTENT_WIDTH = WIDTH - CONTENT_X - 88
MAX_LINES = 15

SCENES = [
    {
        'label': 'bootstrap seeded problem',
        'command': 'erdos bootstrap problem 857',
        'output': [
            ('Bootstrapped problem 857 (Sunflower Conjecture)', GREEN),
            ('Active problem: 857', CREAM),
            ('Active route: anchored_selector_linearization', CREAM),
            ('Scaffold dir: .erdos/scaffolds/857', BLUE),
            ('Artifacts copied: 6', CREAM),
            ('ORP protocol: .erdos/orp/PROTOCOL.md', BLUE),
            ('Checkpoint shelf: .erdos/checkpoints/CHECKPOINTS.md', BLUE),
            ('Next honest move: Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.', SAND),
        ],
    },
    {
        'label': 'inspect live sunflower frontier',
        'command': 'erdos sunflower frontier 857',
        'output': [
            ('Erdos Problem #857 sunflower frontier', GREEN),
            ('Active route: anchored_selector_linearization', CREAM),
            ('Active ticket: T10', CREAM),
            ('First ready atom: T10.G3.A2', RED),
            ('Route focus: Anchored-Selector Linearization', CREAM),
            ('Atom focus: Promote the helper/theorem stack into anchored_selector_linearization_realized', SAND),
            ('Mirage frontiers: 0', CREAM),
            ('This is the only live public route with a dependency-satisfied ready atom.', SAND),
        ],
    },
    {
        'label': 'self-seed a new problem',
        'command': 'erdos seed problem 25 --cluster number-theory',
        'output': [
            ('Seeded local dossier for problem 25', GREEN),
            ('Pull bundle: .erdos/pulls/25', BLUE),
            ('Destination: .erdos/seeded-problems/25', BLUE),
            ('Cluster: number-theory', CREAM),
            ('Harness depth: dossier', CREAM),
            ('Public status review used: yes', CREAM),
            ('Activated: yes', CREAM),
            ('Loop synced: yes', CREAM),
            ('Active route: seed_route_pending', CREAM),
            ('Next honest move: Pull the dossier, freeze the route note, and preserve public-status honesty.', SAND),
        ],
    },
]


def wrap_line(text, font, max_width):
    words = text.split(' ')
    lines = []
    current = ''
    for word in words:
        trial = word if not current else current + ' ' + word
        width = font.getbbox(trial)[2]
        if width <= max_width or not current:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_terminal_base():
    image = Image.new('RGBA', (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((MARGIN, MARGIN, WIDTH - MARGIN, HEIGHT - MARGIN), radius=34, fill=PANEL)
    draw.rounded_rectangle((MARGIN + 24, MARGIN + 24, WIDTH - MARGIN - 24, HEIGHT - MARGIN - 24), radius=20, fill=TERMINAL, outline=ACCENT, width=2)
    draw.rounded_rectangle((MARGIN + 24, MARGIN + 24, WIDTH - MARGIN - 24, MARGIN + 74), radius=20, fill=TITLEBAR)
    draw.rounded_rectangle((MARGIN + 24, MARGIN + 54, WIDTH - MARGIN - 24, MARGIN + 74), radius=0, fill=TITLEBAR)
    draw.ellipse((MARGIN + 14, MARGIN + 14, MARGIN + 30, MARGIN + 30), fill=RED)
    draw.ellipse((MARGIN + 40, MARGIN + 14, MARGIN + 56, MARGIN + 30), fill='#E9C46A')
    draw.ellipse((MARGIN + 66, MARGIN + 14, MARGIN + 82, MARGIN + 30), fill=GREEN)
    draw.text((MARGIN + 108, MARGIN + 10), 'erdos-problems demo', font=MONO_20, fill=MUTED)
    right_label = 'agent-ready research loop'
    right_bbox = draw.textbbox((0, 0), right_label, font=MONO_20)
    right_x = WIDTH - MARGIN - 28 - (right_bbox[2] - right_bbox[0])
    draw.text((right_x, MARGIN + 32), right_label, font=MONO_20, fill=MUTED)
    return image, draw


def render_scene(scene, typed_chars=None, shown_lines=0, cursor=False):
    image, draw = draw_terminal_base()
    label = scene['label']
    pill_text = f"scene · {label}"
    pill_bbox = draw.textbbox((0, 0), pill_text, font=MONO_18)
    pill_w = (pill_bbox[2] - pill_bbox[0]) + 32
    draw.rounded_rectangle((CONTENT_X, SCENE_Y, CONTENT_X + pill_w, SCENE_Y + 32), radius=12, fill='#222222', outline=ACCENT, width=1)
    draw.text((CONTENT_X + 16, SCENE_Y + 6), pill_text, font=MONO_18, fill=SAND)
    prompt = '$ '
    command = scene['command'] if typed_chars is None else scene['command'][:typed_chars]
    command_text = prompt + command + ('_' if cursor else '')
    draw.text((CONTENT_X, CONTENT_Y), command_text, font=MONO_28, fill=ACCENT)
    y = CONTENT_Y + 60
    visible = scene['output'][:shown_lines]
    for text, color in visible:
        wrapped = wrap_line(text, MONO_24, CONTENT_WIDTH)
        for line in wrapped:
            draw.text((CONTENT_X, y), line, font=MONO_24, fill=color)
            y += LINE_HEIGHT
    footer = 'npm install -g erdos-problems'
    footer_bbox = draw.textbbox((0, 0), footer, font=MONO_24)
    footer_w = (footer_bbox[2] - footer_bbox[0]) + 48
    box_x = (WIDTH - footer_w) // 2
    box_y = HEIGHT - 120
    draw.rounded_rectangle((box_x, box_y, box_x + footer_w, box_y + 56), radius=14, fill=ACCENT)
    draw.text((box_x + 24, box_y + 15), footer, font=MONO_24, fill=PANEL)
    return image


frames = []
durations = []
poster = None

for scene in SCENES:
    command = scene['command']
    step = 3 if len(command) < 32 else 4
    for typed in range(1, len(command) + 1, step):
        frame = render_scene(scene, typed_chars=typed, shown_lines=0, cursor=True)
        frames.append(frame)
        durations.append(150)
    frame = render_scene(scene, typed_chars=len(command), shown_lines=0, cursor=False)
    frames.append(frame)
    durations.append(900)
    for idx in range(1, len(scene['output']) + 1):
        frame = render_scene(scene, typed_chars=len(command), shown_lines=idx, cursor=False)
        frames.append(frame)
        durations.append(650 if idx < len(scene['output']) else 2600)

poster = render_scene(SCENES[1], typed_chars=len(SCENES[1]['command']), shown_lines=len(SCENES[1]['output']), cursor=False)
poster.save(POSTER_PATH)
frames[0].save(
    GIF_PATH,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
    disposal=2,
)
print(f'WROTE {GIF_PATH}')
print(f'WROTE {POSTER_PATH}')
