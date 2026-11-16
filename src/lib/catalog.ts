export type Game={id:string;title:string;genre:string;platforms:string[];price:number;oldPrice?:number;tag:string;description:string;art:string};
export const games:Game[]=[
{id:'nebula',title:'NEBULA: ECHOES',genre:'RPG',platforms:['PC','PlayStation'],price:189.9,oldPrice:249.9,tag:'DESTAQUE',description:'Uma jornada cinematográfica através de mundos desconhecidos.',art:'linear-gradient(145deg,#51369d,#1c1738 50%,#e17d52)'},
{id:'velocity',title:'VELOCITY X',genre:'Corrida',platforms:['PC','Xbox'],price:129.9,oldPrice:179.9,tag:'OFERTA',description:'Corridas futuristas com velocidade extrema.',art:'linear-gradient(145deg,#0e4f68,#171a33 50%,#d75e90)'},
{id:'shadow',title:'SHADOW PROTOCOL',genre:'Ação',platforms:['PC','PlayStation','Xbox'],price:219.9,tag:'NOVO',description:'Uma operação secreta em uma metrópole distópica.',art:'linear-gradient(145deg,#153d38,#161927 55%,#8dbf74)'},
{id:'kingdom',title:'KINGDOM OF ASH',genre:'Aventura',platforms:['PC','Nintendo'],price:159.9,tag:'POPULAR',description:'Descubra ruínas, lendas e novos reinos.',art:'linear-gradient(145deg,#684523,#242039 55%,#bb8a51)'},
{id:'orbit',title:'ORBIT ZERO',genre:'Estratégia',platforms:['PC'],price:89.9,tag:'INDIE',description:'Construa sua civilização entre as estrelas.',art:'linear-gradient(145deg,#213e8a,#171a30 60%,#3c9caa)'},
{id:'rift',title:'RIFT RUNNERS',genre:'Ação',platforms:['PC','Xbox','Nintendo'],price:119.9,tag:'MULTIPLAYER',description:'Ação cooperativa através de dimensões.',art:'linear-gradient(145deg,#682d62,#181827 50%,#b94b5a)'}];
