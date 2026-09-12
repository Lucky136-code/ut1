import matplotlib.pyplot as plt
import numpy as np
import os

# Set global design style for matplotlib graphs
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
plt.rcParams['axes.edgecolor'] = '#d0d7de'
plt.rcParams['axes.linewidth'] = 1.2

output_dir = r"c:\Users\91930\Downloads\ut1\pdf_assets"
os.makedirs(output_dir, exist_ok=True)

# Graph 1: Market Growth Rate (Global & India Natural Stone & Tiles Market 2020-2030)
def generate_graph_1():
    years = [2020, 2022, 2024, 2026, 2028, 2030]
    global_market = [245, 272, 310, 352, 398, 450] # in USD Billion
    india_market = [5.8, 7.1, 8.8, 10.7, 12.9, 15.5] # in USD Billion

    fig, ax1 = plt.subplots(figsize=(8, 3.4), dpi=300)

    color1 = '#1b3d33' # Uma Traders dark green
    ax1.set_xlabel('Year', fontsize=10, fontweight='bold', labelpad=4)
    ax1.set_ylabel('Global Market Size ($B)', color=color1, fontsize=10, fontweight='bold')
    line1 = ax1.plot(years, global_market, color=color1, marker='o', linewidth=2.2, markersize=6, label='Global Surface Market ($B)')
    ax1.tick_params(axis='y', labelcolor=color1, labelsize=9)
    ax1.tick_params(axis='x', labelsize=9)
    ax1.grid(True, linestyle='--', alpha=0.5)

    ax2 = ax1.twinx()
    color2 = '#c5a059' # Luxury Gold accent
    ax2.set_ylabel('India Market Size ($B)', color=color2, fontsize=10, fontweight='bold')
    line2 = ax2.plot(years, india_market, color=color2, marker='s', linewidth=2.2, markersize=6, linestyle='--', label='India Market ($B)')
    ax2.tick_params(axis='y', labelcolor=color2, labelsize=9)

    # Combine legends
    lines = line1 + line2
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc='upper left', frameon=True, facecolor='#ffffff', edgecolor='#d0d7de', fontsize=8.5)

    plt.title('Global & Indian Natural Stone & Luxury Tile Market Size (2020 - 2030)', fontsize=11, fontweight='bold', pad=10)
    plt.tight_layout()
    path = os.path.join(output_dir, 'graph1_market_growth.png')
    plt.savefig(path)
    plt.close()
    print(f"Graph 1 saved to {path}")

# Graph 2: Key Decision Factors for Luxury Stone & Surface Buyers
def generate_graph_2():
    factors = [
        'Visual Certainty (3D/AI Preview)',
        'Material Quality & Authentic Texture',
        'Price & Estimate Transparency',
        'Vendor Trust & Reputation',
        'Delivery Speed & Availability'
    ]
    percentages = [42, 26, 18, 9, 5]
    colors = ['#1b3d33', '#2d6a4f', '#52b788', '#c5a059', '#d4a373']

    fig, ax = plt.subplots(figsize=(8, 3.2), dpi=300)
    bars = ax.barh(factors[::-1], percentages[::-1], color=colors[::-1], height=0.55, edgecolor='#1b3d33', linewidth=0.8)

    for bar in bars:
        width = bar.get_width()
        ax.text(width + 1, bar.get_y() + bar.get_height()/2, f'{width}%', 
                va='center', ha='left', fontsize=9, fontweight='bold', color='#1b3d33')

    ax.set_xlim(0, 50)
    ax.set_xlabel('Percentage of Buyers Rating as Top Factor (%)', fontsize=9.5, fontweight='bold', labelpad=4)
    ax.set_title('Primary Factors Influencing Consumer Purchase Decisions in Luxury Surfaces', fontsize=11, fontweight='bold', pad=10)
    ax.tick_params(axis='both', labelsize=8.5)
    ax.grid(axis='x', linestyle='--', alpha=0.5)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()
    path = os.path.join(output_dir, 'graph2_decision_factors.png')
    plt.savefig(path)
    plt.close()
    print(f"Graph 2 saved to {path}")

# Graph 3: Impact of AI Visualizer on Sales Conversion & Decision Time
def generate_graph_3():
    categories = ['Sales Conversion Rate (%)', 'Avg Decision Time (Days)', 'Customer Regret Rate (%)']
    traditional = [14, 18, 34]
    with_visualizer = [48, 2.4, 3]

    x = np.arange(len(categories))
    width = 0.32

    fig, ax = plt.subplots(figsize=(8, 3.2), dpi=300)
    rects1 = ax.bar(x - width/2, traditional, width, label='Traditional Method (Physical Samples)', color='#939598', edgecolor='#6d6e71')
    rects2 = ax.bar(x + width/2, with_visualizer, width, label='With Uma Traders AI Visualizer', color='#1b3d33', edgecolor='#0f231d')

    ax.set_ylabel('Metrics / Scale', fontsize=9.5, fontweight='bold')
    ax.set_title('Performance Impact: Traditional Sales vs. AI Visualizer Workflow', fontsize=11, fontweight='bold', pad=10)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9, fontweight='bold')
    ax.tick_params(axis='y', labelsize=8.5)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#d0d7de', fontsize=8.5)
    ax.grid(axis='y', linestyle='--', alpha=0.5)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    # Add text labels on bars
    for rect in rects1:
        height = rect.get_height()
        ax.annotate(f'{height}',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 2),  # 2 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=8.5, fontweight='bold', color='#414042')

    for rect in rects2:
        height = rect.get_height()
        ax.annotate(f'{height}',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 2),  # 2 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=8.5, fontweight='bold', color='#1b3d33')

    plt.tight_layout()
    path = os.path.join(output_dir, 'graph3_performance_impact.png')
    plt.savefig(path)
    plt.close()
    print(f"Graph 3 saved to {path}")

if __name__ == '__main__':
    generate_graph_1()
    generate_graph_2()
    generate_graph_3()
