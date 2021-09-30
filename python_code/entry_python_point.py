import sys
import os
import hide_text
import utils


utils.log_in_file("Get_the_job_done, those are args:")
for el in sys.argv:
    utils.log_in_file(el)


names_and_paths = dict()  # имя файла: путь до файла
for i in range(1, len(sys.argv)-1, 2):
    hide_text.hide_text(sys.argv[i + 1], sys.argv[i], )
    names_and_paths[sys.argv[i]] = sys.argv[i + 1]

utils.log_in_file(str(names_and_paths))
