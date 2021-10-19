"""

ЕСЛИ ВЫДЕЛЕННЫЙ ТЕКСТ УЖЕ БЫЛ СКРЫТЫМ, ОН ОСТАНЕТСЯ СКРЫТЫМ

не скрывает автоматически сгенерированное содержание и некоторые кривые списки
"""
from typing import List

from docx import Document, opc
import constants, utils_py
from docx.enum.text import WD_COLOR_INDEX

tasks = {
    "1": "hide if colored in any color",
    "2": "hide if not colored in any color",
    "3": "hide if colored in chosen color",
    "4": "hide if not colored in chosen color",
    "5": "hide if italic",
    "6": "hide if not italic",
    "7": "hide if strike",
}


def get_colors() -> List[WD_COLOR_INDEX]:
    try:  # TODO: эту ситуацию вообще нужно допускать?
        with open(f'{constants.utils_path}{constants.color_file}', "r", encoding="utf-8") as f:
            colors = f.read().split(",")
            # when file is empty, split returns empty string and list becomes of length of one
            if len(colors[0]) == 0:
                colors = []
    except FileNotFoundError as ex:
        utils_py.log_in_file(f"GET_COLORS FUNCTION: {ex}")
        return []
    utils_py.log_in_file(f"GET_COLORS. colors: {colors} len(colors): {len(colors)}")
    wd_colors_list = [getattr(WD_COLOR_INDEX, color) for color in colors]
    return wd_colors_list


def hide(path_to_file_with_name: str, file_name: str, task: str):
    utils_py.log_in_file(f"HIDE FUNCTION: FILE PATH: {path_to_file_with_name} FILE NAME: {file_name}")
    utils_py.log_in_file(f"HIDE FUNCTION: TASK NUMBER: {task}, TASK DESCRIPTION: {tasks[task]}")

    try:
        document = Document(path_to_file_with_name)
    except opc.exceptions.PackageNotFoundError:
        utils_py.log_in_file(f"HIDE FUNCTION: PackageNotFoundError {path_to_file_with_name} {file_name}")

        Document().save(f'{constants.complete_path}{file_name}')
        return

    if task in ["3", "4"]:
        colors_list = get_colors()
        if len(colors_list) == 0:
            utils_py.log_in_file(f"HIDE FUNCTION: no colors chosen")
            Document().save(f'{constants.complete_path}{file_name}')
            return

    def change_font_properties(task, run):
        if task == "1":
            if run.font.highlight_color:
                run.font.hidden = True
        elif task == "2":
            if run.font.highlight_color is None:
                run.font.hidden = True
        elif task == "3":
            if run.font.highlight_color in colors_list:
                run.font.hidden = True
        elif task == "4":
            if run.font.highlight_color not in colors_list:
                run.font.hidden = True
        elif task == "5":
            if run.font.italic:
                run.font.hidden = True
        elif task == "6":
            if run.font.italic is None:
                run.font.hidden = True
        elif task == "7":
            if run.font.strike:
                run.font.hidden = True

    for t in document.tables:
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for run in p.runs:
                        change_font_properties(task, run)

    for p in document.paragraphs:
        for run in p.runs:
            change_font_properties(task, run)

    def iterate_footer_header(footer_or_header):
        """
        используем методы  docx библиотеки, чтобы проверить весь текст в колонтитулах.
        работаем с таблицами и с параграфами, которые могут быть в колонтитулах.
        """
        for t in footer_or_header.tables:
            for row in t.rows:
                for cell in row.cells:
                    for p in cell.paragraphs:
                        for run in p.runs:
                            change_font_properties(task, run)

        for p in footer_or_header.paragraphs:
            for run in p.runs:
                change_font_properties(task, run)

    # итерируемся по всем секциям в документе и обрабатываем все три вида верхних и нижних колонтитулов.
    # боковые колонтитулы тоже входят

    for section in document.sections:

        footers_and_headers = (section.footer, section.even_page_footer, section.first_page_footer,
                               section.header, section.even_page_header, section.first_page_header)
        for footer in footers_and_headers:
            iterate_footer_header(footer)

    document.save(f'{constants.complete_path}{file_name}')
