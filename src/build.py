"""Monta o index.html a partir de src/template.html + src/gen.js.
Uso (na raiz do repositório): python src/build.py
"""
from pathlib import Path
src = Path(__file__).parent
html = (src / "template.html").read_text(encoding="utf-8")
gen = (src / "gen.js").read_text(encoding="utf-8")
(src.parent / "index.html").write_text(html.replace("/*GEN*/", gen), encoding="utf-8")
print("index.html atualizado")
