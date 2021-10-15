import sys

import constants
import utils_py

from hide import hide

utils_py.log_in_file(f"Get_the_job_done, ARGS: {sys.argv}")
utils_py.log_in_file("len(sys.argv): "+str(len(sys.argv)))
utils_py.log_in_file(sys.argv[1])

with open(f'{constants.utils_path}{constants.names_file}', "r", encoding="utf-8") as f:
    split_text = f.readlines()
    for i in range(0, len(split_text), 2):
        utils_py.log_in_file(f"ENTRY PYTHON POINT: Path: {split_text[i + 1].strip()}, name: {split_text[i].strip()}")
        hide(split_text[i + 1].strip(), split_text[i].strip(), sys.argv[1])


