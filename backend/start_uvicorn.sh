#!/bin/bash

cd /home/ubuntu/jornal-tgi/backend
source venv/bin/activate

# Iniciar o Uvicorn
exec uvicorn src.main:app --host 0.0.0.0 --port 5000

