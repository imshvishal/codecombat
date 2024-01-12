import os
from contextlib import suppress
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'
path = Path(__file__).resolve().parent.parent / "user1"
TEMP_CODE_FOLDER = "temp_codes"
with suppress(FileExistsError):
    os.mkdir(TEMP_CODE_FOLDER)
    os.mkdir(path)
# os.mkdir(TEMP_CODE_FOLDER)
