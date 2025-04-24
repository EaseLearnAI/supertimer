"use client";

import { useState, useEffect, useRef } from "react";

export default function StatsPage() {
  const [activeRange, setActiveRange] = useState("week");
  const weeklyChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyChartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);
  
  // Load Chart.js dynamically on client side
  useEffect(() => {
    // Dynamic import of Chart.js
    import('chart.js/auto').then((Chart) => {
      if (weeklyChartRef.current && monthlyChartRef.current) {
        initWeeklyChart(Chart.default);
        initMonthlyChart(Chart.default);
      }
      
      // Cleanup on unmount
      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    });
  }, []);
  
  // Update weekly chart when range changes
  useEffect(() => {
    if (!chartInstance) return;
    
    if (activeRange === 'week') {
      chartInstance.data.labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    } else if (activeRange === 'month') {
      chartInstance.data.labels = ['第1周', '第2周', '第3周', '第4周'];
    } else {
      chartInstance.data.labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    }
    chartInstance.update();
  }, [activeRange, chartInstance]);
  
  const initWeeklyChart = (Chart: any) => {
    if (!weeklyChartRef.current) return;
    
    const chart = new Chart(weeklyChartRef.current, {
      type: 'line',
      data: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [
          {
            label: '任务',
            data: [5, 7, 4, 6, 8, 3, 6],
            borderColor: '#007AFF',
            backgroundColor: 'rgba(0, 122, 255, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: '习惯',
            data: [3, 3, 2, 4, 3, 2, 3],
            borderColor: '#AF52DE',
            backgroundColor: 'rgba(175, 82, 222, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: '专注时间(小时)',
            data: [2.5, 3, 1.5, 4, 3.5, 1, 2.5],
            borderColor: '#FF9500',
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });
    
    setChartInstance(chart);
  };
  
  const initMonthlyChart = (Chart: any) => {
    if (!monthlyChartRef.current) return;
    
    const chart = new Chart(monthlyChartRef.current, {
      type: 'bar',
      data: {
        labels: ['任务完成率', '习惯坚持率', '专注效率'],
        datasets: [
          {
            label: '目标',
            data: [100, 100, 100],
            backgroundColor: 'rgba(142, 142, 147, 0.2)',
            borderRadius: 6
          },
          {
            label: '实际',
            data: [75, 85, 65],
            backgroundColor: [
              '#007AFF',
              '#AF52DE',
              '#FF9500'
            ],
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return context.dataset.label + ': ' + context.parsed.x + '%';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value: any) {
                return value + '%';
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
          delay: function(context: any) {
            return context.dataIndex * 300;
          }
        }
      }
    });
  };
  
  const handleExport = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = event.currentTarget;
    button.innerHTML = '<i class="fas fa-check-circle mr-2"></i> 报告已导出';
    button.classList.replace('bg-[#007AFF]', 'bg-[#34C759]');
    
    setTimeout(() => {
      button.innerHTML = '导出统计报告';
      button.classList.replace('bg-[#34C759]', 'bg-[#007AFF]');
    }, 2000);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* iOS Header */}
      <div className="h-11 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-b-black/10">
        <div className="ios-header-title font-semibold text-base">统计</div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Today's Summary */}
        <div className="stat-card bg-white rounded-xl p-5 mb-4 shadow-sm opacity-0 animate-[fadeIn_0.6s_ease_forwards]">
          <div className="stat-header flex justify-between items-center mb-4">
            <div className="stat-title font-semibold text-lg">今日概览</div>
            <div className="stat-action text-[#007AFF] text-sm cursor-pointer">查看详情</div>
          </div>
          
          <div className="metric-cards grid grid-cols-3 gap-2.5">
            <div className="metric-card bg-white rounded-xl p-4 text-center shadow-sm opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.05s' }}>
              <div className="metric-icon text-[#007AFF]">
                <i className="fas fa-tasks"></i>
              </div>
              <div className="metric-value text-2xl font-bold my-2">6</div>
              <div className="metric-label text-xs text-[#8E8E93]">完成任务</div>
            </div>
            
            <div className="metric-card bg-white rounded-xl p-4 text-center shadow-sm opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.07s' }}>
              <div className="metric-icon text-[#AF52DE]">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="metric-value text-2xl font-bold my-2">3</div>
              <div className="metric-label text-xs text-[#8E8E93]">习惯打卡</div>
            </div>
            
            <div className="metric-card bg-white rounded-xl p-4 text-center shadow-sm opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.09s' }}>
              <div className="metric-icon text-[#FF9500]">
                <i className="fas fa-clock"></i>
              </div>
              <div className="metric-value text-2xl font-bold my-2">2.5h</div>
              <div className="metric-label text-xs text-[#8E8E93]">专注时间</div>
            </div>
          </div>
        </div>
        
        {/* Weekly Trends */}
        <div className="stat-card bg-white rounded-xl p-5 mb-4 shadow-sm opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.1s' }}>
          <div className="stat-header flex justify-between items-center mb-4">
            <div className="stat-title font-semibold text-lg">周趋势</div>
            <div className="time-range flex bg-[#F2F2F7] rounded-lg overflow-hidden">
              <div 
                className={`time-option flex-1 text-center py-2 px-3 text-sm cursor-pointer ${activeRange === 'week' ? 'bg-white shadow-sm font-semibold' : ''}`}
                onClick={() => setActiveRange('week')}
              >
                周
              </div>
              <div 
                className={`time-option flex-1 text-center py-2 px-3 text-sm cursor-pointer ${activeRange === 'month' ? 'bg-white shadow-sm font-semibold' : ''}`}
                onClick={() => setActiveRange('month')}
              >
                月
              </div>
              <div 
                className={`time-option flex-1 text-center py-2 px-3 text-sm cursor-pointer ${activeRange === 'year' ? 'bg-white shadow-sm font-semibold' : ''}`}
                onClick={() => setActiveRange('year')}
              >
                年
              </div>
            </div>
          </div>
          
          <div className="chart-container relative h-48 my-5 opacity-0 animate-[fadeIn_0.8s_ease_forwards]" style={{ animationDelay: '0.2s' }}>
            <canvas ref={weeklyChartRef}></canvas>
          </div>
          
          <div className="chart-legend flex justify-center gap-4 mt-4 opacity-0 animate-[fadeIn_0.8s_ease_forwards]" style={{ animationDelay: '0.4s' }}>
            <div className="legend-item flex items-center text-sm">
              <div className="legend-color w-3 h-3 rounded bg-[#007AFF] mr-1.5"></div>
              <div>任务</div>
            </div>
            <div className="legend-item flex items-center text-sm">
              <div className="legend-color w-3 h-3 rounded bg-[#AF52DE] mr-1.5"></div>
              <div>习惯</div>
            </div>
            <div className="legend-item flex items-center text-sm">
              <div className="legend-color w-3 h-3 rounded bg-[#FF9500] mr-1.5"></div>
              <div>专注</div>
            </div>
          </div>
        </div>
        
        {/* Monthly Summary */}
        <div className="stat-card bg-white rounded-xl p-5 mb-4 shadow-sm opacity-0 animate-[fadeIn_0.6s_ease_forwards]" style={{ animationDelay: '0.2s' }}>
          <div className="stat-header flex justify-between items-center mb-4">
            <div className="stat-title font-semibold text-lg">月度汇总</div>
          </div>
          
          <div className="chart-container relative h-48 my-5 opacity-0 animate-[fadeIn_0.8s_ease_forwards]" style={{ animationDelay: '0.3s' }}>
            <canvas ref={monthlyChartRef}></canvas>
          </div>
        </div>
        
        {/* Export Button */}
        <div 
          className="export-button bg-[#007AFF] text-white rounded-xl p-3.5 text-center font-semibold mt-4 cursor-pointer opacity-0 animate-[fadeIn_0.8s_ease_forwards]" 
          style={{ animationDelay: '0.6s' }}
          onClick={handleExport}
        >
          导出统计报告
        </div>
      </div>
    </div>
  );
} 