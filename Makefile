# Nile Bites — one-command tooling
PY ?= python3

.PHONY: help site deck tokens shots regress serve hub clean

help:
	@echo "make site     — rebuild index.html + admin.html from src/"
	@echo "make deck     — regenerate franchise deck PDF"
	@echo "make tokens   — export design tokens (json+css)"
	@echo "make shots    — qa screenshots (desktop/mobile/rtl)"
	@echo "make regress  — full regression: 4 modes + contact sheets + report"
	@echo "make serve    — dev server :8000 with auto-rebuild"
	@echo "make clean    — remove generated shots/regress"

site:
	$(PY) build.py

deck:
	$(PY) make_deck.py && $(PY) make_pitch.py && $(PY) build.py

tokens:
	$(PY) tokens.py

shots:
	$(PY) qa_shots.py

regress:
	$(PY) regress.py

serve:
	$(PY) serve.py

clean:
	rm -rf shots/regress
