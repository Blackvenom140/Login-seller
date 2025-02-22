async function fetchResults() {
    const apiUrl = 'https://api.bdg88zf.com/api/webapi/GetNoaverageEmerdList';
    const requestData = {
        "pageSize": 10,
        "pageNo": 1,
        "typeId": 1,
        "language": 0,
        "random": "c2505d9138da4e3780b2c2b34f2fb789",
        "signature": "7D637E060DA35C0C6E28DC6D23D71BED",
        "timestamp": Math.floor(Date.now() / 1000),
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*',
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            const data = await response.json();
            return data.code === 0 ? data.data.list : null;
        } else {
            console.error('HTTP Error:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Network Error:', error.message);
        return null;
    }
}

function updateResults(resultList) {
    const historyTable = document.getElementById('recentResults');
    historyTable.innerHTML = '';

    resultList.forEach(result => {
        const { issueNumber, number, colour } = result;
        historyTable.innerHTML += `
            <tr>
                <td class='px-4 py-2'>${issueNumber}</td>
                <td class='px-4 py-2'>${colour}</td>
                <td class='px-4 py-2'>${number}</td>
            </tr>
        `;
    });
}

function validateInput() {
    const userInput = document.getElementById('userInputNumber').value;
    if (!/^\d{4}$/.test(userInput)) {
        alert("Please enter a valid 4-digit number.");
        return false;
    }
    return true;
}

function disableButton() {
    const button = document.getElementById('startPrediction');
    button.disabled = true;
    button.classList.add('disabled-btn');
    setTimeout(() => {
        button.disabled = false;
        button.classList.remove('disabled-btn');
    }, 5000);
}

function predictNextResult(resultList) {
    if (resultList.length === 0) return null;

    let numberSequence = resultList.map(r => parseInt(r.number));

    let predictedNumber = ultraSmartPrediction(numberSequence);
    return predictedNumber;
}

function ultraSmartPrediction(sequence) {
    if (sequence.length < 2) return sequence[sequence.length - 1] || 0;

    let markovPrediction = markovChainPrediction(sequence);
    let bayesianPrediction = bayesianFiltering(sequence);
    let patternPrediction = weightedPatternLearning(sequence);

    return avoidRepetition([markovPrediction, bayesianPrediction, patternPrediction], sequence);
}

function markovChainPrediction(seq) {
    let transitions = {};
    for (let i = 0; i < seq.length - 1; i++) {
        let current = seq[i];
        let next = seq[i + 1];
        transitions[current] = transitions[current] || {};
        transitions[current][next] = (transitions[current][next] || 0) + 1;
    }
    let last = seq[seq.length - 1];
    if (transitions[last]) {
        let nextCandidates = transitions[last];
        let predicted = Object.keys(nextCandidates).reduce((a, b) =>
            nextCandidates[a] > nextCandidates[b] ? a : b
        );
        return Number(predicted);
    }
    return seq[seq.length - 1];
}

function bayesianFiltering(seq) {
    let freq = {};
    seq.forEach(num => { freq[num] = (freq[num] || 0) + 1; });
    let predicted = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    return Number(predicted);
}

function weightedPatternLearning(seq) {
    let weightedSum = 0;
    let totalWeight = 0;
    seq.slice(-10).forEach((num, index) => {
        let weight = index + 1;
        weightedSum += num * weight;
        totalWeight += weight;
    });
    return Math.round(weightedSum / totalWeight);
}

function avoidRepetition(predictions, seq) {
    let lastNumber = seq[seq.length - 1];
    let filteredPredictions = predictions.filter(num => num !== lastNumber);
    return filteredPredictions.length > 0 ? filteredPredictions[0] : lastNumber;
}

function classifyNumber(number) {
    return number <= 4 ? "Small" : "Big";
}

function animatePrediction(prediction) {
    const classificationElement = document.getElementById('predictedClassification');
    classificationElement.textContent = classifyNumber(prediction);
}

async function startPrediction() {
    if (!validateInput()) return;
    disableButton();

    const resultList = await fetchResults();
    if (resultList) {
        updateResults(resultList);
        const predictedNumber = predictNextResult(resultList);
        animatePrediction(predictedNumber);
    } else {
        console.error("Failed to fetch or update results.");
    }
}

document.getElementById('startPrediction').addEventListener('click', startPrediction);

fetchResults().then(updateResults);

