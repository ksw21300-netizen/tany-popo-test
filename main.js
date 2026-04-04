document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');

    const generateLottoNumbers = () => {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    };

    const displayNumber = (number) => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.textContent = number;
        numbersContainer.appendChild(numberElement);
    };

    generateBtn.addEventListener('click', () => {
        numbersContainer.innerHTML = '';
        const lottoNumbers = generateLottoNumbers();
        lottoNumbers.forEach(number => {
            displayNumber(number);
        });
    });
});
