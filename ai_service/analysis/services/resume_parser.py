"""
Resume Parser — Extracts text from PDF and DOCX files.

Supports two file formats:
- PDF: Uses PyPDF2 to extract text from each page
- DOCX: Uses python-docx to extract text from paragraphs

Also converts a saved resume (from our database) into plain text format
for AI analysis.
"""

import io
from PyPDF2 import PdfReader
from docx import Document


def extract_text_from_pdf(file_content):
    """
    Extract text from a PDF file.

    Args:
        file_content (bytes): The raw bytes of the PDF file

    Returns:
        str: Extracted text from all pages
    """
    try:
        # Create a PDF reader from the file bytes
        reader = PdfReader(io.BytesIO(file_content))

        # Extract text from each page and join them
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)

        full_text = '\n'.join(text_parts)

        if not full_text.strip():
            raise ValueError('Could not extract any text from the PDF. '
                             'The file might be scanned/image-based.')

        return full_text

    except Exception as e:
        raise ValueError(f'Failed to parse PDF: {str(e)}')


def extract_text_from_docx(file_content):
    """
    Extract text from a DOCX file.

    Args:
        file_content (bytes): The raw bytes of the DOCX file

    Returns:
        str: Extracted text from all paragraphs
    """
    try:
        # Create a Document object from the file bytes
        doc = Document(io.BytesIO(file_content))

        # Extract text from each paragraph
        text_parts = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_parts.append(paragraph.text)

        full_text = '\n'.join(text_parts)

        if not full_text.strip():
            raise ValueError('Could not extract any text from the DOCX file.')

        return full_text

    except Exception as e:
        raise ValueError(f'Failed to parse DOCX: {str(e)}')


def extract_text_from_file(file_content, file_name):
    """
    Extract text from a file based on its extension.

    Args:
        file_content (bytes): The raw bytes of the file
        file_name (str): Original filename (used to determine format)

    Returns:
        str: Extracted text

    Raises:
        ValueError: If the file format is not supported
    """
    file_name_lower = file_name.lower()

    if file_name_lower.endswith('.pdf'):
        return extract_text_from_pdf(file_content)
    elif file_name_lower.endswith('.docx'):
        return extract_text_from_docx(file_content)
    else:
        raise ValueError(
            f'Unsupported file format: {file_name}. '
            'Please upload a PDF or DOCX file.'
        )


def resume_to_text(resume):
    """
    Convert a saved Resume model instance to plain text for AI analysis.

    Takes the structured data from our database and formats it as
    readable text that Claude can analyze.

    Args:
        resume: Resume model instance

    Returns:
        str: Formatted resume text
    """
    if getattr(resume, 'is_uploaded', False) and getattr(resume, 'resume_text', ''):
        return resume.resume_text

    lines = []

    # Personal Info
    info = resume.personal_info or {}
    if info.get('fullName'):
        lines.append(info['fullName'])
    if info.get('email'):
        lines.append(info['email'])
    if info.get('phone'):
        lines.append(info['phone'])
    if info.get('location'):
        lines.append(info['location'])
    if info.get('linkedin'):
        lines.append(f'LinkedIn: {info["linkedin"]}')
    if info.get('website'):
        lines.append(f'Website: {info["website"]}')

    # Summary
    if resume.summary:
        lines.append('\nPROFESSIONAL SUMMARY')
        lines.append(resume.summary)

    # Experience
    if resume.experience:
        lines.append('\nWORK EXPERIENCE')
        for exp in resume.experience:
            title_line = f'{exp.get("title", "")} at {exp.get("company", "")}'
            if exp.get('location'):
                title_line += f' — {exp["location"]}'
            lines.append(title_line)

            date_line = f'{exp.get("startDate", "")} – '
            date_line += 'Present' if exp.get('current') else exp.get('endDate', '')
            lines.append(date_line)

            for bullet in exp.get('bullets', []):
                lines.append(f'• {bullet}')
            lines.append('')  # Blank line between jobs

    # Education
    if resume.education:
        lines.append('\nEDUCATION')
        for edu in resume.education:
            lines.append(f'{edu.get("degree", "")} — {edu.get("institution", "")}')
            date_line = f'{edu.get("startDate", "")} – {edu.get("endDate", "")}'
            lines.append(date_line)
            if edu.get('gpa'):
                lines.append(f'GPA: {edu["gpa"]}')
            lines.append('')

    # Skills
    if resume.skills:
        lines.append('\nSKILLS')
        lines.append(', '.join(resume.skills))

    # Projects
    if resume.projects:
        lines.append('\nPROJECTS')
        for proj in resume.projects:
            lines.append(proj.get('name', ''))
            if proj.get('description'):
                lines.append(proj['description'])
            if proj.get('technologies'):
                lines.append(f'Technologies: {", ".join(proj["technologies"])}')
            if proj.get('link'):
                lines.append(f'Link: {proj["link"]}')
            lines.append('')

    return '\n'.join(lines)
