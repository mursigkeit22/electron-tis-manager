import sys

import constants
import utils_py
# from scripts._2 import script_2
# from scripts._3 import script_3
# from scripts._4 import script_4
from highlighted import hide_not_highlighted_text
from italic import hide_non_italic_text

# scripts_dict = {"1": hide_text, "2": script_2,
#                 "3": script_3, "4": script_4, }

utils_py.log_in_file(f"Get_the_job_done, ARGS: {sys.argv}")
utils_py.log_in_file(len(sys.argv))
utils_py.log_in_file(sys.argv[1:])
utils_py.log_in_file(type(sys.argv[1:]))


with open(f'{constants.utils_path}{constants.names_file}', "r", encoding="utf-8") as f:
    split_text = f.readlines()
    for i in range(0, len(split_text), 2):
        utils_py.log_in_file(f"ENTRY PYTHON POINT: Path: {split_text[i + 1].strip()}, name: {split_text[i].strip()}")
        #hide_not_highlighted_text(split_text[i + 1].strip(), split_text[i].strip(), )
        hide_non_italic_text(split_text[i + 1].strip(), split_text[i].strip(), )


#TODO: открываем документ в ентри поинт,
 # вызываем для него нужные скрипты в соответствии с аргс по очереди,
 # сохраняем документ