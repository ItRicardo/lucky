import { useLotteryStore } from '@/store/useStore';

const ResultPage = () => {
  const { prizes, winners, settings } = useLotteryStore();

  // 按照奖项设置的顺序分组获奖名单
  const groupedWinners = prizes.map(prize => {
    const prizeWinners = winners.filter(winner => winner.prizeId === prize.id);
    return { prize, winners: prizeWinners };
  }).filter(({ winners }) => winners.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
          {settings.title || '抽奖结果'}
        </h1>
        
        <div className="space-y-8">
          {groupedWinners.map(({ prize, winners }) => (
            <div key={prize.id} className="bg-white/5 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {prize.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {winners.map(winner => (
                  <p key={winner.id} className="text-white text-lg">
                    {winner.name} - {winner.dept}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {groupedWinners.length === 0 && (
          <div className="text-center text-white text-xl py-12">
            暂无获奖记录
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;