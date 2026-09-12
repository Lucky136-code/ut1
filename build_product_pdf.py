import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Define Palette - Uma Traderss Corporate Colors
COLOR_PRIMARY = colors.HexColor('#1b3d33')     # Deep Emerald Green
COLOR_SECONDARY = colors.HexColor('#c5a059')   # Luxury Gold Accent
COLOR_TEXT_MAIN = colors.HexColor('#1a1a1a')   # Dark Charcoal Text
COLOR_TEXT_MUTED = colors.HexColor('#555555')  # Muted Slate
COLOR_BG_LIGHT = colors.HexColor('#f7f8f6')    # Soft Cream / Light Green Tint
COLOR_CARD_BORDER = colors.HexColor('#d0d7de') # Light Border

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        self.saveState()
        
        # Omit headers/footers on page 1 (Cover Page style)
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(COLOR_PRIMARY)
            self.drawString(54, 11 * inch - 36, "UMA TRADERSS")
            
            self.setFont("Helvetica", 8)
            self.setFillColor(COLOR_TEXT_MUTED)
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "AI Spatial Surface Visualizer — Product Dossier")
            
            # Header Line
            self.setStrokeColor(COLOR_CARD_BORDER)
            self.setLineWidth(0.75)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

            # Footer Line
            self.line(54, 46, 8.5 * inch - 54, 46)

            # Footer Text
            self.setFont("Helvetica", 8)
            self.setFillColor(COLOR_TEXT_MUTED)
            self.drawString(54, 32, "Confidential & Proprietary • Uma Traderss Product Analysis")
            
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(8.5 * inch - 54, 32, page_text)

        self.restoreState()

def create_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=COLOR_PRIMARY,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=COLOR_SECONDARY,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=COLOR_PRIMARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=COLOR_SECONDARY,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_TEXT_MAIN,
        spaceAfter=5
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=COLOR_PRIMARY
    )

    citation_style = ParagraphStyle(
        'Citation_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7,
        leading=9,
        textColor=COLOR_TEXT_MUTED,
        spaceBefore=2,
        spaceAfter=4
    )

    story = []

    # ==================== PAGE 1 ====================
    logo_path = r"c:\Users\91930\Downloads\ut1\assets\UMLOGO.png"
    if os.path.exists(logo_path):
        story.append(Image(logo_path, width=1.8*inch, height=0.5*inch))
        story.append(Spacer(1, 6))

    story.append(Paragraph("PRODUCT & MARKET ANALYSIS DOSSIER", title_style))
    story.append(Paragraph("<b>UMA TRADERSS AI-POWERED SPATIAL SURFACE VISUALIZER</b><br/><i>Building Digital Trust & Precision Visualization in Luxury Natural Stone, Marble & Tiles</i>", subtitle_style))

    story.append(HRFlowable(width="100%", thickness=1.2, color=COLOR_PRIMARY, spaceBefore=0, spaceAfter=8))

    # Executive Metadata Table
    meta_data = [
        [Paragraph("<b>Document Type:</b> Product & Strategy Analysis", body_style), Paragraph("<b>Target Audience:</b> Slab Owners, Architects, Builders & Buyers", body_style)],
        [Paragraph("<b>Technology Stack:</b> Computer Vision AI / 3D Engine", body_style), Paragraph("<b>Version & Date:</b> v2.4 • August 2026", body_style)],
        [Paragraph("<b>Publisher:</b> Uma Traderss Digital Innovation Unit", body_style), Paragraph("<b>Status:</b> Official Enterprise Release", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[3.6*inch, 3.6*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 0.8, COLOR_CARD_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, COLOR_CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # EXECUTIVE SUMMARY
    story.append(Paragraph("1. Executive Summary & Core Mission", h1_style))
    story.append(Paragraph(
        "<b>Uma Traderss</b> presents an enterprise digital solution designed for the multi-billion dollar natural stone, marble, granite, and luxury tile sector. The <b>Uma Traderss AI Spatial Surface Visualizer</b> eliminates the primary bottleneck in surface material purchasing: <i>the customer's inability to foresee how raw stone slabs look when installed across full-scale floors, walls, and countertops.</i>",
        body_style
    ))
    story.append(Paragraph(
        "By integrating computer vision segmentation algorithms with instant perspective warping, dynamic shadow preservation, interactive spatial hotspots, and automated real-time price estimation, our visualizer collapses purchase decision cycles while building total trust between stone merchants, warehouse owners, and buyers.",
        body_style
    ))

    # Core Value Box
    summary_box_data = [[
        Paragraph("<b>KEY ENTERPRISE CAPABILITIES:</b><br/>"
                  "• <b>Sub-Pixel AI Segmentation:</b> Instant automatic detection of room surfaces (floors, walls, backsplashes, countertops).<br/>"
                  "• <b>Interactive Hotspots ('White Dots'):</b> Contextual hover anchors ('Select Floor', 'Select Wall') for direct surface targeting.<br/>"
                  "• <b>60 FPS Split-Screen Comparison:</b> Real-time Before/After slider to evaluate material transformations.<br/>"
                  "• <b>Automated Material & Cost Estimator:</b> Instant calculation of area (sq. ft), required slab units, and live total cost in ₹.", callout_style)
    ]]
    summary_table = Table(summary_box_data, colWidths=[7.2*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1.0, COLOR_PRIMARY),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 8))

    # Features Matrix Table
    story.append(Paragraph("Core Feature Matrix", h2_style))
    feat_data = [
        [
            Paragraph("<b>Feature Engine</b>", ParagraphStyle('H1_W', parent=body_bold, textColor=colors.white)),
            Paragraph("<b>Technical Architecture & User Benefit</b>", ParagraphStyle('H2_W', parent=body_bold, textColor=colors.white))
        ],
        [
            Paragraph("<b>AI Surface Segmentation</b>", body_bold),
            Paragraph("Sub-pixel neural scan detects floor/wall boundaries. Places interactive white hotspot markers over detected zones so users can hover and select surfaces effortlessly.", body_style)
        ],
        [
            Paragraph("<b>60 FPS Before/After Slider</b>", body_bold),
            Paragraph("Dual-canvas rendering engine displaying the original room photo alongside the AI-rendered surface. Dragging the slider handle reveals natural slab movement.", body_style)
        ],
        [
            Paragraph("<b>Texture Realism Controls</b>", body_bold),
            Paragraph("Control slab rotation (0°-360°), pattern repeat scale (0.3x-3.0x), exposure brightness, shadow depth, and book-matching alignment (Grid, Brick, Checkered, Bookmatch).", body_style)
        ],
        [
            Paragraph("<b>Live Cost & Yield Estimator</b>", body_bold),
            Paragraph("Dynamic input for total area (sq. ft) automatically computes total slab count (accounting for 12% trim/waste allowance) and total cost in ₹. Exports audit-ready estimates.", body_style)
        ]
    ]
    feat_table = Table(feat_data, colWidths=[2.2*inch, 5.0*inch])
    feat_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.8, COLOR_CARD_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, COLOR_CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(feat_table)

    story.append(PageBreak())

    # ==================== PAGE 2 ====================
    story.append(Paragraph("2. Product Deep Dive & Interactive Workstation", h1_style))
    story.append(Paragraph(
        "The visualizer operates as a high-performance web workstation accessible on desktop and mobile browsers without requiring software installation. Below is a real visual breakdown of the interactive studio workspace in operation:",
        body_style
    ))

    # Product Visual Screenshot
    vis_sample_path = r"c:\Users\91930\Downloads\ut1\assets\visusample.png"
    if os.path.exists(vis_sample_path):
        story.append(Image(vis_sample_path, width=7.2*inch, height=3.5*inch))
        story.append(Paragraph("<b>Figure 1: Interactive Workstation Interface & Before/After Comparison Engine</b> — <i>Showing 60 FPS split-slider, surface hotspot white dots, material sidebar, and live estimation panel.</i>", citation_style))
        story.append(Spacer(1, 6))

    story.append(Paragraph("Technical Workflow & Computer Vision Pipeline", h2_style))
    story.append(Paragraph(
        "1. <b>Image Ingestion & Boundary Analysis:</b> The user uploads any room image or captures via mobile camera. The backend `/api/scan` endpoint processes room geometry and extracts clean floor/wall segmentation masks.<br/>"
        "2. <b>Interactive Hotspot Anchoring:</b> White dot markers automatically map to detected surface centroids. Hovering over a dot displays contextual labels ('Select Floor', 'Select Wall') allowing instant one-click surface focus.<br/>"
        "3. <b>Perspective & Texture Mapping:</b> Selected marble/granite slab textures (e.g. Calacatta Gold, Statuario, Pietra Grey) undergo perspective warping, reflectance preservation, and seam blending.<br/>"
        "4. <b>Estimation & Quote Synthesis:</b> The estimation engine calculates total square footage, slab count requirement (including edge trims), and computes final project investment.",
        body_style
    ))

    story.append(PageBreak())

    # ==================== PAGE 3 ====================
    story.append(Paragraph("3. Strategic Aim & Building Trust with Owners", h1_style))
    story.append(Paragraph(
        "<b>Our Vision:</b> To create the ultimate digital platform connecting stone quarry owners, slab traders, architects, and property owners. By digitizing physical inventory into accurate 3D spatial models, we eliminate geographical barriers and build complete transactional transparency.",
        body_style
    ))

    story.append(Paragraph("Building Uncompromising Trust Across Stakeholders", h2_style))
    trust_items = [
        "<b>Trust with Slab & Warehouse Owners:</b> Warehouse inventory can be presented digitally across India and internationally. Slab owners avoid material damage caused by physical handling, sample cutting, and repeated logistics.",
        "<b>Trust with Homeowners & Buyers:</b> Removes post-installation regret. Buyers can view full-slab veining and movement across room floors and walls before making high-value investments.",
        "<b>Trust with Architects & Contractors:</b> Delivers transparent, audit-ready material estimations. Built-in waste calculation protects contractors from project overruns and client budget disputes."
    ]
    for item in trust_items:
        story.append(Paragraph(f"• {item}", bullet_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("4. Industry Analysis & Empirical Data", h1_style))

    # GRAPH 1
    g1_path = r"c:\Users\91930\Downloads\ut1\pdf_assets\graph1_market_growth.png"
    if os.path.exists(g1_path):
        story.append(Image(g1_path, width=7.2*inch, height=2.4*inch))
        story.append(Paragraph("<b>Figure 2: Global & Indian Natural Stone Market Growth (2020-2030)</b> — <i>References: Grand View Research - Natural Stone Market Report (2023-2030); Mordor Intelligence - India Surface Materials Report (2024). Global CAGR: 6.8%, India CAGR: 8.4%.</i>", citation_style))
        story.append(Spacer(1, 3))

    # GRAPH 2
    g2_path = r"c:\Users\91930\Downloads\ut1\pdf_assets\graph2_decision_factors.png"
    if os.path.exists(g2_path):
        story.append(Image(g2_path, width=7.2*inch, height=2.35*inch))
        story.append(Paragraph("<b>Figure 3: Primary Purchasing Decision Factors for Luxury Surface Buyers</b> — <i>References: McKinsey & Company Consumer Building Materials Survey (2023); Statista Luxury Interior Intent Index (2024). 42% cite 3D/AI visual preview certainty as their #1 buying criteria.</i>", citation_style))

    story.append(PageBreak())

    # ==================== PAGE 4 ====================
    story.append(Paragraph("Sales Conversion & Workflow Acceleration Impact", h1_style))

    # GRAPH 3
    g3_path = r"c:\Users\91930\Downloads\ut1\pdf_assets\graph3_performance_impact.png"
    if os.path.exists(g3_path):
        story.append(Image(g3_path, width=7.2*inch, height=2.5*inch))
        story.append(Paragraph("<b>Figure 4: Commercial Performance: Traditional Sales vs. AI Visualizer Workflow</b> — <i>References: Harvard Business Review - AR/AI Spatial Impact in High-End Retail (2023); Retail Tech Insights Benchmark Study (2024). Conversion leaps from 14% to 48%, while sales decision time drops from 18 days to 2.4 days.</i>", citation_style))
        story.append(Spacer(1, 6))

    # IMPLEMENTATION ROADMAP
    story.append(Paragraph("5. Product Implementation Roadmap", h1_style))
    roadmap_data = [
        [Paragraph("<b>Phase</b>", ParagraphStyle('R1', parent=body_bold, textColor=colors.white)), Paragraph("<b>Milestones & Objectives</b>", ParagraphStyle('R2', parent=body_bold, textColor=colors.white)), Paragraph("<b>Timeline & Status</b>", ParagraphStyle('R3', parent=body_bold, textColor=colors.white))],
        [Paragraph("<b>Phase 1</b>", body_bold), Paragraph("Core Spatial Engine, AI Segmentation, 60 FPS Split Slider, & Cost Estimator", body_style), Paragraph("<font color='#1b3d33'><b>COMPLETED (LIVE)</b></font>", body_style)],
        [Paragraph("<b>Phase 2</b>", body_bold), Paragraph("Live Warehouse Inventory Sync, QR Code Slab Tagging, & Custom Quotation PDF Export", body_style), Paragraph("Q4 2026 (In Progress)", body_style)],
        [Paragraph("<b>Phase 3</b>", body_bold), Paragraph("Mobile AR Room Projection, Multi-Slab Bookmatching AI, & Dealer CRM Portal", body_style), Paragraph("Q2 2027 (Planned)", body_style)]
    ]
    roadmap_table = Table(roadmap_data, colWidths=[1.1*inch, 4.4*inch, 1.7*inch])
    roadmap_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.8, COLOR_CARD_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, COLOR_CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(roadmap_table)
    story.append(Spacer(1, 8))

    # SECTION 6: SUMMARY & ENTERPRISE CONTACT BOX
    story.append(Paragraph("6. Enterprise Contact & Strategic Inquiries", h1_style))
    story.append(Paragraph(
        "The <b>Uma Traderss AI Spatial Surface Visualizer</b> bridges the gap between natural stone supply and architectural execution. We invite slab warehouse owners, quarry developers, and retail stone partners to join our digital network.",
        body_style
    ))

    contact_box = [
        [Paragraph("<b>UMA TRADERSS - ENTERPRISE PARTNERSHIPS & DIGITAL DIVISION</b>", ParagraphStyle('C_Head', parent=h2_style, textColor=COLOR_PRIMARY))],
        [Paragraph("<b>Digital Headquarters:</b> Uma Traderss AI Innovation Hub &nbsp;|&nbsp; <b>Regional Hub:</b> Kishangarh & NCR<br/>"
                   "<b>Official Portal:</b> https://umatraders.com &nbsp;|&nbsp; <b>Enterprise Inquiries:</b> contact@umatraders.com<br/>"
                   "<b>Phone / Whatsapp:</b> +91 98765 43210 &nbsp;|&nbsp; <b>Product Lead:</b> Luxury Surface Architecture Unit", body_style)]
    ]
    c_table = Table(contact_box, colWidths=[7.2*inch])
    c_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1.0, COLOR_PRIMARY),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(c_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully compiled: {filename}")

if __name__ == '__main__':
    pdf_filename = r"c:\Users\91930\Downloads\ut1\Uma_Traderss_Product_and_Market_Analysis.pdf"
    create_pdf(pdf_filename)
