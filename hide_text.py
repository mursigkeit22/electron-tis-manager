import docx
from docx import *

def hide_text(path_to_file, file_name):

    document = Document(f'{path_to_file}/{file_name}.docx')
    sections_list = document._element.xpath('//w:sectPr')
    elements_list = document._element.xpath('//w:r')

    WPML_URI = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    ODML_URI = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
    tag_f = WPML_URI + 'ftr'
    tag_id = ODML_URI + 'id'
    tag_rPr = WPML_URI + 'rPr'
    tag_r = WPML_URI + 'r'
    tag_highlight = WPML_URI + 'highlight'
    tag_t = WPML_URI + 't'
    tag_vanish = WPML_URI + 'vanish'


    def get_ids_headers_footers(sections):
        """ по идее, там 3 headers и 3 footers (четный, нечетный и для первого листа).
         Боковые колонтитулы спрятаны в headers (не знаю, всегда или нет).
         Из каждого колонтитула забираем его id, по которому ниже сможем вытащить xml с ним"""
        id_list = []

        for section in sections:
            header_ref_with_id = section.xpath('//w:headerReference')
            footer_ref_with_id = section.xpath('//w:footerReference')
            for ref in header_ref_with_id:
                id = ref.get(tag_id)
                id_list.append(id)
            for ref in footer_ref_with_id:
                id = ref.get(tag_id)
                id_list.append(id)
        return id_list


    def hide_not_highlighted_text(elements):
        for element in elements:
            try:
                rprs = element.findall(tag_rPr)
                if len(rprs) == 0:
                    tag_text = element.find(tag_t)
                    rpr = docx.oxml.shared.OxmlElement('w:rPr')
                    rpr.append(docx.oxml.shared.OxmlElement('w:vanish'))
                    tag_text.addprevious(rpr)

                for rPr in rprs:
                    high = rPr.findall(tag_highlight)
                    if len(high) == 0:
                        rPr.append(docx.oxml.shared.OxmlElement('w:vanish'))

            except AttributeError:  # when there is no text
                pass


    # скрываем невыделенный текст везде кроме колонтитулов
    hide_not_highlighted_text(elements_list)

    header_footer_ids = get_ids_headers_footers(sections_list)

    for id in header_footer_ids:
        """ вытаскиваем xml с колонтитулами по его id"""

        header_or_footer_element = document.sections._document_part.rels[id].target_part.element

        h_f_elements = header_or_footer_element.xpath('//w:r')
        hide_not_highlighted_text(h_f_elements)

    document.save('./result/{file_name}.docx')