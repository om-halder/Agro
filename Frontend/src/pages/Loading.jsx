import fruitBasket from '../assets/fruit_basket.gif';

const Loading = () => {
  return (
    <div className="load flex flex-col items-center justify-center h-screen ">
      <div className="text-center">
        <img
          src={fruitBasket}
          alt="Loading..."
          className="w-48 h-48 mx-auto mb-4 drop-shadow-lg"
        />
        <p className="text-green-800 font-bold text-2xl">
          Harvesting Freshness...
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
