import sys

import hide_text
import utils_py
import constants

utils_py.log_in_file("Get_the_job_done, those are args:")
for el in sys.argv:
    utils_py.log_in_file(el)

with open(f'{constants.utils_path}{constants.names_file}', "r", encoding="utf-8") as f:
    split_text = f.readlines()
    for i in range(0, len(split_text), 2):
        utils_py.log_in_file(f"ENTRY PYTHON POINT: Path: {split_text[i + 1].strip()}, name: {split_text[i].strip()}")
        hide_text.hide_text(split_text[i + 1].strip(), split_text[i].strip(), )
