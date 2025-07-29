#!/bin/bash

# Function for addition
add() {
    echo "Result: $(($1 + $2))"
}

# Function for subtraction
subtract() {
    echo "Result: $(($1 - $2))"
}

# Function for multiplication
multiply() {
    echo "Result: $(($1 * $2))"
}

# Function for division
divide() {
    if [ $2 -eq 0 ]; then
        echo "Error: Division by zero"
    else
        echo "Result: $(($1 / $2))"
    fi
}

# User interface
echo "Welcome to the Calculator!"
echo "Select operation:"
echo "1. Addition"
echo "2. Subtraction"
echo "3. Multiplication"
echo "4. Division"
read -p "Enter choice (1-4): " choice

read -p "Enter first number: " num1
read -p "Enter second number: " num2

case $choice in
    1) add $num1 $num2 ;;
    2) subtract $num1 $num2 ;;
    3) multiply $num1 $num2 ;;
    4) divide $num1 $num2 ;;
    *) echo "Invalid choice" ;;
esac