const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED_COLOR, EXPANSION_PACK_TYPES } = require('../../common/constants');
const networking = require('../../networking');
const utils = require('../../utils/common');

module.exports = {
  name: 'packs',
  description: 'Lists the packs that can be played.',
  execute(message, options) {
    for (const key in EXPANSION_PACK_TYPES) {
      const type = EXPANSION_PACK_TYPES[key];

      networking.getPackListByType(type.id, (data, err) => {
        if (err) {
          message.reply(err.message);
          return;
        }

        const { packs } = data;

        const formattedPackList = packs.map(pack => `**${pack.name}** - *${pack.id}*\n`);
        const packListEmbedFieldContent = utils.splitForMessageEmbedField(formattedPackList);

        const embed = new MessageEmbed()
          .setTitle(`${type.name} Available Packs:`)
          .setColor(MESSAGE_EMBED_COLOR)
          .setDescription(
            `This is a list of all the available ${type.name} packs that can be played with this bot. The data is\
            organized in the following way: **Pack Name** - *Pack ID*.`
          );

        packListEmbedFieldContent.forEach((packEntry, index) => {
          embed.addField(`Page ${index + 1}:`, packEntry);
        });

        message.channel.send(embed);
      });
    }
  }
};
