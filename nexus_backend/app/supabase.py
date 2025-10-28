import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables from .env (if present)
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Simple package-level Supabase client. Import this from other modules as:
# from app.supabase import supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
