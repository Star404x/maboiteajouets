#!/usr/bin/env python3

import re

# IDs товаров для удаления
to_remove = ['p-003', 'p-005', 'p-006', 'p-011', 'p-013']

# Читаем файл
with open('src/lib/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Для каждого товара находим и удаляем его блок
for product_id in to_remove:
    # Шаблон: ищем id блока и удаляем весь объект до }
    pattern = r'  \{\s+id: "' + product_id + r'",[\s\S]*?\n  \},?\s*\n'
    content = re.sub(pattern, '', content)

# Пишем обратно
with open('src/lib/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Удалены 5 макетов из products.ts")
