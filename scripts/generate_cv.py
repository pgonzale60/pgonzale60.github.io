#!/usr/bin/env python3
"""
Lightweight CV generator: Markdown (limited) -> styled HTML.

Supported Markdown features for this CV:
- Headings: #, ##, ###
- Horizontal rule: --- on its own line
- Unordered lists: lines starting with "- "
- Bold: **text**
- Italic: *text*
- Manual line breaks: two spaces at end of line become <br>

Outputs: assets/cv.html using css/cv.css for styling & print.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "assets" / "cv.md"
HTML_PATH = ROOT / "assets" / "cv.html"
CSS_PATH = ROOT / "css" / "cv.css"


def md_inline_format(text: str) -> str:
    # Escape HTML special chars first
    text = (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )

    # Manual line breaks: two spaces at EOL -> <br>
    text = re.sub(r"\s{2,}$", "<br>", text)

    # Bold **...**
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    # Italic *...* (avoid matching bold which is already replaced)
    text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", text)
    # Linkify URLs (http/https/www)
    def _linkify(m: re.Match[str]) -> str:
        url = m.group(0)
        href = url
        if url.startswith("www."):
            href = f"https://{url}"
        return f"<a href=\"{href}\">{url}</a>"

    url_pattern = r"(?:(?:https?://)|(?:www\.))[\w\-._~:/?#\[\]@!$&'()*+,;=%]+"
    text = re.sub(url_pattern, _linkify, text)
    return text


def md_to_html(md: str) -> str:
    lines = md.splitlines()
    html_lines: list[str] = []
    in_list = False
    para_buf: list[str] = []

    def flush_paragraph():
        nonlocal para_buf
        if para_buf:
            # Join paragraph lines with space (respect explicit <br> already inserted)
            joined = " ".join(para_buf).strip()
            if joined:
                html_lines.append(f"<p>{joined}</p>")
        para_buf = []

    def close_list():
        nonlocal in_list
        if in_list:
            html_lines.append("</ul>")
            in_list = False

    for raw in lines:
        line = raw.rstrip("\n")
        # Horizontal rule
        if re.fullmatch(r"\s*-{3,}\s*", line):
            flush_paragraph()
            close_list()
            html_lines.append("<hr>")
            continue

        # Headings
        m = re.match(r"^(#{1,3})\s+(.*)$", line)
        if m:
            flush_paragraph()
            close_list()
            level = len(m.group(1))
            content = md_inline_format(m.group(2).strip())
            html_lines.append(f"<h{level}>{content}</h{level}>")
            continue

        # Unordered list item
        m = re.match(r"^\s*-\s+(.*)$", line)
        if m:
            flush_paragraph()
            if not in_list:
                html_lines.append("<ul>")
                in_list = True
            content = md_inline_format(m.group(1).strip())
            html_lines.append(f"  <li>{content}</li>")
            continue

        # Blank line => paragraph break
        if not line.strip():
            flush_paragraph()
            close_list()
            continue

        # Regular text -> accumulate for paragraph
        close_list()
        para_buf.append(md_inline_format(line))

    # Flush tail
    flush_paragraph()
    close_list()

    body = "\n".join(html_lines)

    # Wrap with minimal, elegant template
    template = f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
  <title>CV — Pablo González de la Rosa</title>
  <link rel=\"stylesheet\" href=\"../css/cv.css\">
  <meta name=\"description\" content=\"Curriculum Vitae of Pablo González de la Rosa\">
</head>
<body>
  <main class=\"cv\">
    {body}
  </main>
</body>
</html>"""
    return template


def main() -> None:
    if not MD_PATH.exists():
        raise SystemExit(f"Markdown not found: {MD_PATH}")

    md = MD_PATH.read_text(encoding="utf-8")
    html = md_to_html(md)
    HTML_PATH.write_text(html, encoding="utf-8")
    print(f"Wrote {HTML_PATH.relative_to(ROOT)}")
    if not CSS_PATH.exists():
        print(f"Note: stylesheet missing at {CSS_PATH.relative_to(ROOT)} — add css/cv.css for styling.")


if __name__ == "__main__":
    main()
