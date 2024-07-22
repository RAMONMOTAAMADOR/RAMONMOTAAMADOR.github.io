// Dados reais dos bancos com ajuste de resgate
const investmentData = [
    { bank: 'Sicredi', startBalance: 1809082.07, investments: 0, redemptions: 70022.38, endBalance: 1806908.56, returns: [0.82, 0.88, 0.83, 0.50, 0.70] },
    { bank: 'XP', startBalance: 3791799.00, investments: 200000, redemptions: 0, endBalance: 4158002.28, returns: [0.79, 0.57, 1.19, 0.76, 0.85] },
    { bank: 'Caixa', startBalance: 316853.24, investments: 17100, redemptions: 0, endBalance: 343909.74, returns: [0.74, 0.81, 0.73, 0.77, 0.06] },
    { bank: 'BB', startBalance: 2017817.16, investments: 0, redemptions: 0, endBalance: 2042814.16, returns: [-0.08, 0.72, 1.06, -0.38, -0.08] },
    { bank: 'Itaú', startBalance: 2782165.57, investments: 2200000, redemptions: 0, endBalance: 5123327.93, returns: [1.12, 0.96, 0.37, 0.61, 0.76] },
    { bank: 'Bradesco', startBalance: 330546.04, investments: 142745.49, redemptions: 11923.22, endBalance: 476829.34, returns: [1.04, 0.47, 0.82, 0.73, 0.67] },
    { bank: 'Acentra', startBalance: 881828.39, investments: 58.60, redemptions: 0, endBalance: 921436.53, returns: [0.95, 0.86, 0.81, 0.95, 0.81] }
];

// Dados reais dos benchmarks
const benchmarks = {
    CDI: [0.97, 0.80, 0.83, 0.89, 0.83, 0.79, 0.47],
    IPCA: [0.42, 0.83, 0.16, 0.38, 0.46, 0.21, NaN], // IPCA de Julho ainda não divulgado
    Ibovespa: [-4.79, -0.99, -0.71, -1.70, -3.04, 1.48, 4.03]
};

// Função para preencher a tabela com os dados de investimento
function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    let totalStartBalance = 0;
    let totalEndBalance = 0;
    let totalProfit = 0;
    let totalInvestments = 0;
    let totalRedemptions = 0;

    data.forEach(item => {
        const profit = item.endBalance - item.startBalance - item.investments + item.redemptions;
        const numberOfMonths = item.returns.length;
        const averageReturn = item.returns.reduce((a, b) => a + b, 0) / numberOfMonths;
        const returnPercentage = averageReturn * numberOfMonths; // Corrigido

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.bank}</td>
            <td>${item.startBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${item.investments.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${item.redemptions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${item.endBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${returnPercentage.toFixed(2)}%</td> <!-- Corrigido -->
            <td>${profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${averageReturn.toFixed(2)}%</td>
        `;
        tableBody.appendChild(row);

        // Somando totais
        totalStartBalance += item.startBalance;
        totalEndBalance += item.endBalance;
        totalProfit += profit;
        totalInvestments += item.investments;
        totalRedemptions += item.redemptions;
    });

    // Preenchendo o rodapé da tabela com totais
    document.getElementById('total-start-balance').textContent = totalStartBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-end-balance').textContent = totalEndBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-profit').textContent = totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-investments').textContent = totalInvestments.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-redemptions').textContent = totalRedemptions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para preencher a tabela de benchmarks
function populateBenchmarksTable(benchmarks) {
    const benchmarksTableBody = document.getElementById('benchmarks-table-body');
    benchmarksTableBody.innerHTML = '';

    Object.keys(benchmarks).forEach(index => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index}</td>
            ${benchmarks[index].map(value => `<td>${Number.isNaN(value) ? 'N/A' : value.toFixed(2) + '%'}%</td>`).join('')}
        `;
        benchmarksTableBody.appendChild(row);
    });
}

// Função para gerar o gráfico de comparação de linha
function generateComparisonChart(data) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
    const datasets = data.map(item => ({
        label: item.bank,
        data: item.returns.slice(0, labels.length),
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.4
    }));

    // Adicionando dados dos benchmarks ao gráfico de comparação
    Object.keys(benchmarks).forEach(benchmark => {
        datasets.push({
            label: benchmark,
            data: benchmarks[benchmark].slice(0, labels.length),
            fill: false,
            borderColor: getRandomColor(),
            borderDash: [5, 5],
            tension: 0.4
        });
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => {
                            const label = context.dataset.label || '';
                            return label ? `${label}: ${context.raw.toFixed(2)}%` : null;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Comparação de Rentabilidade'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Função para gerar o gráfico de linha da rentabilidade total do portfólio
function generateTotalReturnsChart(data) {
    const ctx = document.getElementById('totalReturnsChart').getContext('2d');
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
    const totalReturns = data.map(item => item.returns.reduce((a, b) => a + b, 0) / item.returns.length);

    const benchmarkDatasets = Object.keys(benchmarks).map(benchmark => ({
        label: benchmark,
        data: benchmarks[benchmark].slice(0, labels.length),
        fill: false,
        borderColor: getRandomColor(),
        borderDash: [5, 5],
        tension: 0.4
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Rentabilidade Total do Portfólio',
                    data: totalReturns,
                    fill: false,
                    borderColor: '#4caf50',
                    tension: 0.4
                },
                ...benchmarkDatasets
            ]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => {
                            const label = context.dataset.label || '';
                            return label ? `${label}: ${context.raw.toFixed(2)}%` : null;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Rentabilidade Total do Portfólio vs Benchmarks'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Função para gerar o gráfico de pizza de distribuição do saldo final por banco
function generatePieChart(data) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const labels = data.map(item => item.bank);
    const values = data.map(item => item.endBalance);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribuição do Saldo Final',
                data: values,
                backgroundColor: generateRandomColors(values.length),
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => `${context.label}: ${context.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                    }
                },
                title: {
                    display: true,
                    text: 'Distribuição de Portfólio por Banco'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Função para gerar o gráfico de barras da rentabilidade percentual média dos bancos
function generateBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    const sortedData = data.map(item => {
        const averageReturn = item.returns.reduce((a, b) => a + b, 0) / item.returns.length;
        return {
            bank: item.bank,
            averageReturn: averageReturn
        };
    }).sort((a, b) => b.averageReturn - a.averageReturn);

    const labels = sortedData.map(item => item.bank);
    const values = sortedData.map(item => item.averageReturn);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rentabilidade Percentual Média',
                data: values,
                backgroundColor: '#4caf50',
                borderColor: '#388e3c',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => `${context.label}: ${context.raw.toFixed(2)}%`
                    }
                },
                title: {
                    display: true,
                    text: 'Rentabilidade Percentual Média dos Bancos'
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Bancos'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Rentabilidade (%)'
                    },
                    ticks: {
                        callback: value => `${value.toFixed(2)}%`
                    }
                }
            }
        }
    });
}

// Função para gerar o gráfico de barras do ranking de rentabilidade percentual dos bancos
function generateRankingChart(data) {
    const ctx = document.getElementById('rankingChart').getContext('2d');
    const sortedData = data.map(item => {
        const averageReturn = item.returns.reduce((a, b) => a + b, 0) / item.returns.length;
        return {
            bank: item.bank,
            averageReturn: averageReturn
        };
    }).sort((a, b) => b.averageReturn - a.averageReturn);

    const labels = sortedData.map(item => item.bank);
    const values = sortedData.map(item => item.averageReturn);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rentabilidade Percentual',
                data: values,
                backgroundColor: '#ff5722',
                borderColor: '#e64a19',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => `${context.label}: ${context.raw.toFixed(2)}%`
                    }
                },
                title: {
                    display: true,
                    text: 'Ranking de Rentabilidade Percentual dos Bancos'
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Bancos'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Rentabilidade (%)'
                    },
                    ticks: {
                        callback: value => `${value.toFixed(2)}%`
                    }
                }
            }
        }
    });
}

// Função para gerar uma cor aleatória
function getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
}

// Função para gerar várias cores aleatórias
function generateRandomColors(num) {
    return Array.from({ length: num }, () => getRandomColor());
}

// Inicialização dos gráficos e tabelas
document.addEventListener('DOMContentLoaded', () => {
    populateTable(investmentData);
    populateBenchmarksTable(benchmarks);
    generateComparisonChart(investmentData);
    generateTotalReturnsChart(investmentData);
    generatePieChart(investmentData);
    generateBarChart(investmentData); // Gera o gráfico de barras verde
    generateRankingChart(investmentData); // Gera o gráfico de barras laranja
});
