// ELMİNSTÊR

const settings = require("./settings.json");
const ms = require("ms");

msggiveaways = [];
msgdatabase = [];

// Elminstêr
const Discord = require("discord.js");
const client = new Discord.Client({
    presence: { activity: { name: settings.status.name, type: settings.status.type }, status: settings.status.status },
    messageCacheLifetime: 300,
    messageSweepInterval: 600,
});

client.login(settings.bot.token);

// Discord Bot Events

client.on('ready', () => {
    console.log('[Bot Aktif] Token Doğru Çalıştı!');
});


client.on('message', async message => {
	if (message.author.bot) return;
    if (message.channel.type == "dm") return;
    if (msggiveaways.length !== 0) {
        for (var i = 0, len = msggiveaways.length; i < len; i++) {
            if (msggiveaways[i].id == message.guild.id) {
                let test = msgdatabase[i].filter(u => u.id == message.author.id);
                if (test.length !== 0) {
                    msgdatabase[i] = msgdatabase[i].filter(u => u.id !== message.author.id);
                    msgdatabase[i].push({id: message.author.id, count: test[0].count + 1})
                } else {
                    msgdatabase[i].push({id: message.author.id, count: 1})
                }
            }
        }
    }
    if (!message.member.hasPermission('MANAGE_GUILD')) return;
    if (!message.content.startsWith(settings.bot.prefix)) return;
    let args = message.content.slice(settings.bot.prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    try {
        if (cmd == "giveaway") {
            if (args[0]) {
                if (args[5]) {
                    let time = (typeof ms(args[0]) == "number" ? ms(args[0]) : (isNaN(parseFloat(args[0])) ? undefined : parseFloat(args[0]) * 1000));
                    let winners = parseFloat(args[1]);
                    let serverid = args[2];
                    let rolevar = args[3];
                    let messagecountvar = args[4];
                    let testargs = args;
                    testargs.shift();
                    testargs.shift();
                    testargs.shift();
                    testargs.shift();
                    testargs.shift();
                    let prize = testargs.join(" ").split(" | ");
                    if (!time) {
                        message.channel.send(
                            new Discord.MessageEmbed()
                                .setTitle('__Codleak__')
                                .setColor("#E70000")
                                .setDescription(` İlk Seçenek Bir Sayı Olmalıdır!.`)
                        );
                    } else {
                        if (time < 5000 || time > 2678400000) {
                            message.channel.send(
                                new Discord.MessageEmbed()
                                    .setTitle('__Codleak__')
                                    .setColor("#E70000")
                                    .setDescription(`İlk Seçenek 5 saniyeden Küçük 31 günden Büyük Olamaz!.`)
                            );
                        } else {
                            if (isNaN(winners)) {
                                message.channel.send(
                                    new Discord.MessageEmbed()
                                        .setTitle('__Codleak__')
                                        .setColor("#E70000")
                                        .setDescription(`İkinci Seçenek  Bir Sayı Olmalıdır!.`)
                                );
                            } else {
                                if (winners < 1 || winners > 10) {
                                    message.channel.send(
                                        new Discord.MessageEmbed()
                                            .setTitle('__Codleak__')
                                            .setColor("#E70000")
                                            .setDescription(` İkinci Seçenek 1'den az 10'dan Büyük Olamaz!.`)
                                    );
                                } else {
                                    requirements = [];
                                    if (serverid !== "yok") {
                                        let server = await client.guilds.cache.get(serverid);
                                        if (!server) {
                                            message.channel.send(
                                                new Discord.MessageEmbed()
                                                    .setTitle('__CodLeak__')
                                                    .setColor("#E70000")
                                                    .setDescription(`Sunucu İD girilmedi!.`)
                                            );
                                            return;
                                        } else {
                                            let invite = await (server.channels.cache.filter(c => c.type === 'text').find(x => x.position == 0)).createInvite(
                                                {
                                                  maxAge: time
                                                },
                                                `Çekiliş komutu Kullanıldı: ${message.author.tag}`
                                            )
                                            requirements.push(`Sunucuya Katıl:  [${server.name}](${invite}) (${server.id})`);
                                        };
                                    };
                                    if (rolevar !== "yok") {
                                        let role = message.guild.roles.cache.get(rolevar);
                                        if (!role) {
                                            message.channel.send(
                                                new Discord.MessageEmbed()
                                                    .setTitle('__Codleak__')
                                                    .setColor("#E70000")
                                                    .setDescription(`4.seçenek Bir Rol İd olmalıdır!`)
                                            );
                                            return;
                                        } else {
                                            requirements.push(`Bu Role Sahip Olmalısınız!: <@&${role.id}> (${role.id})`);
                                        }
                                    };
                                    if (messagecountvar !== "yok") {
                                        let messagecount = parseFloat(messagecountvar);
                                        if (isNaN(messagecount)) {
                                            message.channel.send(
                                                new Discord.MessageEmbed()
                                                    .setTitle('__Codleak__')
                                                    .setColor("#E70000")
                                                    .setDescription(`5.seçenek Bir Sayı Olmalıdır.`)
                                            );
                                            return;
                                        } else {
                                            if (messagecount < 1 || messagecount > 1000) {
                                                message.channel.send(
                                                    new Discord.MessageEmbed()
                                                        .setTitle('__Codleak__')
                                                        .setColor("#E70000")
                                                        .setDescription(`5. seçenek 1  den az 100'den fazla olamaz!`)
                                                );
                                                return;
                                            } else {
                                                msgcounttest = msggiveaways.length; // Elminstêr
                                                msgdatabase.push([]);
                                                msggiveaways.push({id:message.guild.id,count:messagecount});
                                                requirements.push(` ${messagecount} Adet Yeni Mesaj Yollamalısın!`);
                                            };
                                        };
                                    } else {
                                        msgcounttest = null;
                                    };
                                    let thing = msgcounttest;
                                    message.delete();
                                    let embed = new Discord.MessageEmbed()
                                        .setTitle('Çekiliş! ' + prize[0])
                                        .setColor("BLACK")
                                        .setDescription(`Çekilişe Katılmak İçin 🎉 Simgesine Tıklayın.`)
                                        .addField("Kazananlar", "Kazanan Sayısı **" + winners + "**")
                                        .addField("Şartlar", (await requirements).length == 0 ? "Yok!" : requirements.join("\n") + (!prize[1] ? "" : "\n" + prize.join(" | ").slice(prize[0].length + 3)))
                                        .setFooter("Bitmesine Kalan Süre" + ms(time, {long:true}))
                                    message.channel.send(embed).then(msg => {
                                        msg.react("🎉");
                                        let filter = async (reaction, user) => {
                                            if (user.id !== client.user.id) {
                                                if (reaction.emoji.name == "🎉") {
                                                    let userreacts = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
                                                    if (serverid !== "yok") {
                                                        let server = await client.guilds.cache.get(serverid);
                                                        if (server) {
                                                            if (server.members.cache.filter(u => u.id == user.id).array().length == 0) {
                                                                for (let reaction of userreacts.values()) {
                                                                    await reaction.users.remove(user.id);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (messagecountvar !== "yok") {
                                                        let messagecount = parseFloat(messagecountvar);
                                                        if (msgdatabase[thing].length == 0) {
                                                            for (let reaction of userreacts.values()) {
                                                                await reaction.users.remove(user.id);
                                                            }
                                                        } else {
                                                            for (var i = 0, len = msgdatabase[thing].length; i < len; i++) {
                                                                if (msgdatabase[thing][i].id == message.author.id) {
                                                                    let test = msgdatabase[thing][i];
                                                                    if (test.id == user.id) {
                                                                        if (test.count < messagecount) {
                                                                            for (let reaction of userreacts.values()) {
                                                                                await reaction.users.remove(user.id);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (rolevar !== "yok") {
                                                        let role = message.guild.roles.cache.get(rolevar);
                                                        if (role) {
                                                            if (!message.guild.members.cache.get(user.id).roles.cache.has(role.id)) {
                                                                for (let reaction of userreacts.values()) {
                                                                    await reaction.users.remove(user.id);
                                                                }
                                                            }
                                                        }
                                                    }
                                                };
                                            };
                                        };
                                        msg.awaitReactions(filter, { 
                                            max: null, 
                                            time: time 
                                        }).then(async collected => {
                                        }).catch(err => {});
                                        setTimeout(
                                            async function() {
                                                // Reroll breaks before of:
                                                /*
                                                if (typeof (await thing) == "number") {
                                                    delete msggiveaways[await thing];
                                                    msggiveaways = msggiveaways.filter(function (el) {
                                                        return el != null;
                                                    });
                                                    delete msgdatabase[await thing];
                                                    msgdatabase = msgdatabase.filter(function (el) {
                                                        return el != null;
                                                    });
                                                }
                                                */
                                                let msg2 = await message.channel.messages.fetch(msg.id);
                                                if (await msg2) {
                                                    if (msg2.embeds[0].description == "Çekiliş Bitti.") return;
                                                    let react = await msg2.reactions.cache.get("🎉").users ? (await msg2.reactions.cache.get("🎉").users.fetch()).array().filter(user => user.id !== client.user.id) : [];
                                                    if (react.length == 0) {
                                                        await msg2.edit(
                                                            new Discord.MessageEmbed()
                                                                .setTitle('Çekiliş! ' + prize[0])
                                                                .setDescription(`Giveaway is over.`)
                                                                .addField("Kazananlar", "Kazanan Yok.")
                                                                .addField("Şartlar", (await requirements).length == 0 ? "Yok!" : requirements.join("\n"))
                                                                .setFooter("Kazananlar" + winners + ":)")
                                                        )
                                                        message.channel.send(":tada: **Çekiliş Bitti.** Kazananlar: Kazanan YokN.")
                                                    } else {
                                                        let users = [];
                                                        for (var i = 0, len = winners; i < len; i++) {
                                                            let random = Math.floor(Math.random() * react.length);
                                                            if (react.length == 0) {
                                                                i == winners;
                                                            } else {
                                                                let id = react[random].id;
                                                                if (users.includes(id)) {
                                                                    i--
                                                                } else {
                                                                    let pass = true;
                                                                    if (!message.guild.members.cache.get(id)) pass = false;
                                                                    if (serverid !== "yok") {
                                                                        let server = await client.guilds.cache.get(serverid);
                                                                        if (server) {
                                                                            if (server.members.cache.filter(u => u.id == id).array().length == 0) {
                                                                                pass = false;
                                                                            }
                                                                        }
                                                                    }
                                                                    if (messagecountvar !== "yok") {
                                                                        let messagecount = parseFloat(messagecountvar);
                                                                        if (msgdatabase[thing].length == 0) {
                                                                            pass = false
                                                                        } else {
                                                                            for (var i = 0, len = msgdatabase[thing].length; i < len; i++) {
                                                                                if (msgdatabase[thing][i].id == id) {
                                                                                    let test = msgdatabase[thing][i];
                                                                                    if (test.id == id) {
                                                                                        if (test.count < messagecount) {
                                                                                            pass = false
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    if (rolevar !== "yok") {
                                                                        let role = message.guild.roles.cache.get(rolevar);
                                                                        if (role) {
                                                                            if (!message.guild.members.cache.get(id).roles.cache.has(role.id)) {
                                                                                pass = false
                                                                            }
                                                                        }
                                                                    }
                                                                    if (pass == true) {
                                                                        users.push("<@" + id + ">");
                                                                    } else {
                                                                        i--;
                                                                    }
                                                                    delete react[random];
                                                                    react = react.filter(function (el) {
                                                                        return el != null;
                                                                    });
                                                                }   
                                                            }
                                                        };
                                                        await msg2.edit(
                                                            new Discord.MessageEmbed()
                                                                .setTitle('Çekiliş! ' + prize[0])
                                                                .setDescription(`Çekiliş Bitti.`)
                                                                .addField("Kazananlar", users.length !== 0 ? users.join("\n") : "Kazanan Yok.")
                                                                .addField("Şartlar", (await requirements).length == 0 ? "Yok!" : requirements.join("\n"))
                                                                .setFooter(" " + winners + " Kazanlar")
                                                        )
                                                        message.channel.send(":tada: **Çekiliş Bitti** Kazanan:" + (users.length == 0 ? " Kazanan Yok." : "\n- " + users.join("\n- ")))
                                                    }
                                                }
                                            }
                                        , time);
                                    }).catch(err => {
                                    });
                                };
                            };
                        };
                    };
                } else {
                    message.channel.send(
                        new Discord.MessageEmbed()
                            .setTitle('__Codleak__')
                            .setColor("#E70000")
                            .setDescription(`Hatalı Kullanım. Örnek Kullanım \`${settings.bot.prefix}giveaway <zaman> <kazanan sayısı> <sunucu id ya da "yok"> <rol id ya da"yok"> <atması gereken mesaj sayısı  ya da "yok"> <ödül>\`.`)
                    );
                };
            } else {
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle('__Codleak__')
                        .setColor("#E70000")
                        .setDescription(`Hatalı Kullanım Şöyle Kullanmalısın: \`${settings.bot.prefix}giveaway <zaman> <kazanan sayısı> <sunucu id ya da "yok"> <rol id ya da "yok"> <atması gereken mesaj sayısı ya da "yok"> <ödül>\`.`)
                );
            };
        } else if (cmd == "reroll") {
            if (args[0] && !args[1]) {
               message.channel.messages.fetch(args[0]).then(rerollmsg => {
                    reroll();
                    async function reroll() {
                        let invalidmsg = new Discord.MessageEmbed()
                            .setTitle('__Codleak__')
                            .setColor("#E70000")
                            .setDescription(`Bu Bir Mesaj İdsi Değil Kontrol Et!.`)
                        if (rerollmsg.author.id == client.user.id) {
                            if (rerollmsg.embeds.length !== 0) {
                                if (rerollmsg.embeds[0].title.startsWith("Çekiliş!")) {
                                    if (rerollmsg.embeds[0].description == "Çekiliş Bitti") {
                                        let users = [];
                                        let react = await rerollmsg.reactions.cache.get("🎉").users ? (await rerollmsg.reactions.cache.get("🎉").users.fetch()).array().filter(user => user.id !== client.user.id) : [];
                                        let requirements = rerollmsg.embeds[0].fields[1].value == "yok!" ? [] : rerollmsg.embeds[0].fields[1].value.split("\n");
                                        let winners = parseFloat(rerollmsg.embeds[0].footer.text.slice("Kazananlar".length));
                                        for (var i = 0, len = winners; i < len; i++) {
                                            let random = Math.floor(Math.random() * react.length);
                                            if (react.length == 0) {
                                                i == winners;
                                            } else {
                                                let id = react[random].id;
                                                if (users.includes(id)) {
                                                    i--
                                                } else {
                                                    let pass = true;
                                                    if (!message.guild.members.cache.get(id)) pass = false;
                                                    let checkserver = requirements.filter(t => t.startsWith("Join"));
                                                    if (checkserver.length !== 0) {
                                                        let serverid = checkserver[0].slice(0, -1).slice(-18);
                                                        let server = await client.guilds.cache.get(serverid);
                                                        if (server) {
                                                            if (server.members.cache.filter(u => u.id == id).array().length == 0) {
                                                                pass = false;
                                                            }
                                                        }
                                                    }
                                                    /*
                                                    if (requirements.filter(t => t.startsWith("Send")).length !== 0) {
                                                        let messagecount = parseFloat(requirements.filter(t => t.startsWith("Send")).slice("Send".length));
                                                        if (msgdatabase[thing].length == 0) {
                                                            pass = false
                                                        } else {
                                                            for (var i = 0, len = msgdatabase[thing].length; i < len; i++) {
                                                                if (msgdatabase[thing][i].id == id) {
                                                                    let test = msgdatabase[thing][i];
                                                                    if (test.id == id) {
                                                                        if (test.count < messagecount) {
                                                                            pass = false
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    */
                                                    if (pass == true) {
                                                        users.push("<@" + id + ">");
                                                    } else {
                                                        i--;
                                                    }
                                                    delete react[random];
                                                    react = react.filter(function (el) {
                                                        return el != null;
                                                    });
                                                }   
                                            }
                                        };
                                        message.delete();
                                        await rerollmsg.edit(
                                            new Discord.MessageEmbed()
                                                .setTitle(rerollmsg.embeds[0].title)
                                                .setColor("GREEN")
                                                .setDescription(rerollmsg.embeds[0].description)
                                                .addField("Kazananlar", users.length !== 0 ? users.join("\n") : "Kazanan Yok.")
                                                .addField("Şartlar", rerollmsg.embeds[0].fields[1].value)
                                                .setFooter(rerollmsg.embeds[0].footer.text)
                                        )
                                        message.channel.send(":tada: **Çekiliş Bitti.** Kazananlar:" + (users.length == 0 ? " Kazanan Yok." : "\n- " + users.join("\n- ")))
                                    } else {
                                        message.channel.send(
                                            new Discord.MessageEmbed()
                                                .setTitle('__CodLeak__')
                                                .setColor("#E70000")
                                                .setDescription(`Bu Çekiliş Daha Bitmemiş.`)
                                        )
                                    }
                                } else {
                                    message.channel.send(invalidmsg);
                                }
                            } else {
                                message.channel.send(invalidmsg);
                            }
                        } else {
                            message.channel.send(
                                new Discord.MessageEmbed()
                                    .setTitle('__Codleak__')
                                    .setColor("#E70000")
                                    .setDescription(`Bu İD'ye Sahip Mesaj Bota Ait değil!.`)
                            );
                        }
                    }
                }).catch(err => {
                    message.channel.send(
                        new Discord.MessageEmbed()
                            .setTitle('__Codleak__')
                            .setColor("#E70000")
                            .setDescription(`Boyle Bir Mesaj İD'si Bulamadım`)
                    );
                });
            } else {
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle('__Codleak__')
                        .setColor("#E70000")
                        .setDescription(`Hatalı Kullanim. Örnek Kullanım:  \`${settings.bot.prefix}reroll <mesaj id>\`.\n Çekilişin Olduğu Kanal da Kullan.\n\n Şartları Kontrol Etmez!`)
                );
            }
        } else if (cmd == "end") {
            if (args[0] && !args[1]) {
               message.channel.messages.fetch(args[0]).then(rerollmsg => {
                    reroll();
                    async function reroll() {
                        let invalidmsg = new Discord.MessageEmbed()
                            .setTitle('Çekiliş Bitir')
                            .setColor("#E70000")
                            .setDescription(`Bu Bir Mesaj İD değil.`)
                        if (rerollmsg.author.id == client.user.id) {
                            if (rerollmsg.embeds.length !== 0) {
                                if (rerollmsg.embeds[0].title.startsWith("Çekiliş!")) {
                                    if (rerollmsg.embeds[0].description !== "Çekiliş Bitti.") {
                                        let users = [];
                                        let react = await rerollmsg.reactions.cache.get("🎉").users ? (await rerollmsg.reactions.cache.get("🎉").users.fetch()).array().filter(user => user.id !== client.user.id) : [];
                                        let requirements = rerollmsg.embeds[0].fields[1].value == "Yok!" ? [] : rerollmsg.embeds[0].fields[1].value.split("\n");
                                        let winners = parseFloat(rerollmsg.embeds[0].footer.text.slice("Kazananlar ".length));
                                        for (var i = 0, len = winners; i < len; i++) {
                                            let random = Math.floor(Math.random() * react.length);
                                            if (react.length == 0) {
                                                i == winners;
                                            } else {
                                                let id = react[random].id;
                                                if (users.includes(id)) {
                                                    i--
                                                } else {
                                                    let pass = true;
                                                    if (!message.guild.members.cache.get(id)) pass = false;
                                                    let checkserver = requirements.filter(t => t.startsWith("Join"));
                                                    if (checkserver.length !== 0) {
                                                        let serverid = checkserver[0].slice(0, -1).slice(-18);
                                                        let server = await client.guilds.cache.get(serverid);
                                                        if (server) {
                                                            if (server.members.cache.filter(u => u.id == id).array().length == 0) {
                                                                pass = false;
                                                            }
                                                        }
                                                    }
                                                    if (pass == true) {
                                                        users.push("<@" + id + ">");
                                                    } else {
                                                        i--;
                                                    }
                                                    delete react[random];
                                                    react = react.filter(function (el) {
                                                        return el != null;
                                                    });
                                                }   
                                            }
                                        };
                                        message.delete();
                                        await rerollmsg.edit(
                                            new Discord.MessageEmbed()
                                                .setTitle(rerollmsg.embeds[0].title)
                                                .setColor("GREEN")
                                                .setDescription("Çekiliş Bitti.")
                                                .addField("Kazananlar", users.length !== 0 ? users.join("\n") : "Kazanan Yok.")
                                                .addField("Şartlar", rerollmsg.embeds[0].fields[1].value)
                                                .setFooter(rerollmsg.embeds[0].footer.text)
                                        )
                                        message.channel.send(":tada: **Çekiliş Bitti.** Kazananlar:" + (users.length == 0 ? " Kazanan Yok." : "\n- " + users.join("\n- ")))
                                    } else {
                                        message.channel.send(
                                            new Discord.MessageEmbed()
                                                .setTitle('__Codleak__')
                                                .setColor("#E70000")
                                                .setDescription(`Bu Çekiliş Zaten Bitmiş.`)
                                        )
                                    }
                                } else {
                                    message.channel.send(invalidmsg);
                                }
                            } else {
                                message.channel.send(invalidmsg);
                            }
                        } else {
                            message.channel.send(
                                new Discord.MessageEmbed()
                                    .setTitle('__CodLeak__')
                                    .setColor("#E70000")
                                    .setDescription(`Bu Mesaj İdsi Bota Ait Değil!`)
                            );
                        }
                    }
                }).catch(err => {
                    message.channel.send(
                        new Discord.MessageEmbed()
                            .setTitle('__Codleak__')
                            .setColor("#E70000")
                            .setDescription(`Böyle Bir Mesaj İD'si Bulamadım!`)
                    );
                });
            } else {
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle('__Codleak__')
                        .setColor("#E70000")
                        .setDescription(`Hatalı Kullanım. Örnek Kullanım:\`${settings.bot.prefix}end <mesaj id>\`.\nÇekilişin Yapıldığı Kanalda Kullan.\n\nMesaj Veya rol Kontrolü Yapmaz.`)
                );
            }
        }
    } catch(err) {
        console.log(`Bu Komutta hata Çıktı: ${cmd}:`);
        console.log(err);
    };
});
