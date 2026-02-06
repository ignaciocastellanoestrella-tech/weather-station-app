from PIL import Image, ImageDraw, ImageFont
import os

# Crear directorio assets si no existe
os.makedirs('assets', exist_ok=True)

# Colores
bg_color = (66, 153, 225)  # Azul
text_color = (255, 255, 255)  # Blanco

# Icon 1024x1024
icon = Image.new('RGB', (1024, 1024), bg_color)
draw = ImageDraw.Draw(icon)
# Dibujar un símbolo de nube simple
draw.ellipse([312, 412, 712, 612], fill=text_color)
draw.ellipse([212, 462, 512, 662], fill=text_color)
draw.ellipse([512, 462, 812, 662], fill=text_color)
icon.save('assets/icon.png')
print('✓ icon.png creado')

# Adaptive icon 1024x1024
adaptive = Image.new('RGB', (1024, 1024), bg_color)
draw = ImageDraw.Draw(adaptive)
draw.ellipse([312, 412, 712, 612], fill=text_color)
draw.ellipse([212, 462, 512, 662], fill=text_color)
draw.ellipse([512, 462, 812, 662], fill=text_color)
adaptive.save('assets/adaptive-icon.png')
print('✓ adaptive-icon.png creado')

# Splash 1284x2778
splash = Image.new('RGB', (1284, 2778), bg_color)
draw = ImageDraw.Draw(splash)
# Centrar la nube
draw.ellipse([492, 1239, 792, 1389], fill=text_color)
draw.ellipse([392, 1289, 642, 1539], fill=text_color)
draw.ellipse([642, 1289, 892, 1539], fill=text_color)
splash.save('assets/splash.png')
print('✓ splash.png creado')

# Favicon 48x48
favicon = Image.new('RGB', (48, 48), bg_color)
draw = ImageDraw.Draw(favicon)
draw.ellipse([12, 16, 36, 32], fill=text_color)
draw.ellipse([8, 20, 24, 36], fill=text_color)
draw.ellipse([24, 20, 40, 36], fill=text_color)
favicon.save('assets/favicon.png')
print('✓ favicon.png creado')

print('\n✅ Todos los iconos creados exitosamente!')
