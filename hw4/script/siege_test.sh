#!/bin/bash

# Вказуємо кількість запитів і кількість користувачів
NUM_REQUESTS=100    # Загальна кількість запитів
CONCURRENT_USERS=100  # Кількість одночасних користувачів

echo "Початок навантажувального тесту для POST-запитів..."
siege -c $CONCURRENT_USERS -r $NUM_REQUESTS -f post_data.txt

