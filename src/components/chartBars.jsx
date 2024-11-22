import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import useAuth from '../hooks/useAuth';

// Configuração do gráfico
const chartConfig = {
    type: "bar",
    height: 240,
    series: [
        {
            name: "Calorias Consumidas",
            data: [],
        },
    ],
    options: {
        chart: {
            toolbar: {
                show: false,
            },
        },
        title: {
            show: "",
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#059669"], 
        plotOptions: {
            bar: {
                columnWidth: "40%",
                borderRadius: 2,
            },
        },
        xaxis: {
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            labels: {
                style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                },
            },
            categories: [
                "00h", "01h", "02h", "03h", "04h", "05h", "06h", "07h", "08h", "09h", "10h", "11h",
                "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"
            ],
        },
        yaxis: {
            max: undefined,
            labels: {
                style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                },
            },
        },
        grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 5,
                right: 20,
            },
        },
        fill: {
            opacity: 0.8,
        },
        tooltip: {
            theme: "dark",
        },
    },
};

// Componente de gráfico
export default function ChartBars() {
    const [caloriesData, setCaloriesData] = useState(new Array(24).fill(0)); 
    const [userCaloriesNeeded, setUserCaloriesNeeded] = useState(null);

    // Verifica se o usuário está logado
    const user = useAuth();
    const userId = user ? user.id : null;

    // Estado para controlar o carregamento
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Buscar as refeições
        const fetchMeals = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/meal/meals?user_id=${userId}`);
                
                // Verifica se a requisição foi bem-sucedida
                if (!response.ok) {
                    throw new Error('Erro ao carregar as refeições');
                }

                // Converte os dados da refeição
                const data = await response.json();
                const newCaloriesData = new Array(24).fill(0);

                // Itera sobre as refeições e adiciona as calorias
                data.forEach(meal => {
                    const mealHour = new Date(meal.date).getHours();
                    const mealCalories = meal.total_calories; 
                    newCaloriesData[mealHour] += mealCalories;
                });
                setCaloriesData(newCaloriesData);
            } catch (error) {
                console.error('Erro ao carregar refeições:', error);
            }
        };

        // Busca as necessidades calóricas do usuário
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/user/${userId}/needs`);
                
                // Verifica se a requisição foi bem-sucedida
                if (response.ok) {
                    const data = await response.json();
                    setUserCaloriesNeeded(data.calories_needed);
                } else {
                    console.error('Erro ao buscar as necessidades calóricas do usuário');
                }
            } catch (error) {
                console.error("Erro ao buscar as necessidades do usuário:", error);
            }
        };

        // Verifica se o ID do usuário foi obtido e carrega os dados
        if (userId) {
            fetchMeals();
            fetchUserInfo();
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    // Atualizando a configuração do gráfico com a altura máxima do eixo Y com base nas calorias necessárias do usuário
    const updatedChartConfig = {
        ...chartConfig,
        options: {
            ...chartConfig.options,
            yaxis: {
                ...chartConfig.options.yaxis,
                max: userCaloriesNeeded,  
                min: 0,  
                tickAmount: 5,
            },
        },
    };
    

    return (
        <Card>
            <CardHeader floated={false} shadow={false} color="transparent" className="flex flex-col gap-4 rounded-none md:flex-row md:items-center">
                <div className="flex-auto px-6">
                    <Typography variant="h6" color="blue-gray">
                        Calorias consumidas por horário
                    </Typography>
                </div>
            </CardHeader>
            <CardBody className="px-2 pb-0">
                <Chart 
                    {...updatedChartConfig} 
                    options={updatedChartConfig.options} 
                    series={[{ ...updatedChartConfig.series[0], data: caloriesData }]} 
                />
            </CardBody>
        </Card>
    );
}
