<template>
    <link rel="stylesheet"
    type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <link rel="stylesheet"
    type="text/css" href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css" />
    
    <NuxtPage />
</template>

<script setup>

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
    @apply liteScroll;
    box-sizing: border-box;
}
body {
    all: unset;
    background: #191a1c;
    font-family: "Inter";
    color: white;
    font-size: 0.9rem;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}
#__nuxt {
    width: 100vw;
    height: 100vh;
    display: block;
}

.text-success { color: #4B9C4E; }
.bg-success { background: #4B9C4E; }

#filesExplorer {
    width: 18%;
    /* height: 100%; */
    padding: 10px 10px;
    background: #222326;
    border: 1px solid #333539;
}

#filesExplorer__title {
    margin-bottom: 5px;
    font-size: 1.1rem;
}

.liteScroll {
    &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
    }
    
    &::-webkit-scrollbar-track {
        background: #333333;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #616161;
    }
}

.liteScrollLight {
    &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
    }
    
    &::-webkit-scrollbar-track {
        background: #acacac;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #333333;
    }
}

</style>