const randomChannel = () => {
  const id = `${Math.floor(Math.random() * 100000)}`;
  const viewable = Math.random() < 0.5;
  return {
    id,
    viewable
  };
};

const createChannelMock = (type) => {
  const channel = randomChannel();
  if (type === 'voice') {
    channel.joinable = Math.random() < 0.5;
  }
  channel.type = type;
  return channel;
};

module.exports = createChannelMock;
