<template>
  <div class="content">
    <div class="not-found-container">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/pokemon-mini-game-vue.appspot.com/o/not-found-image.png?alt=media&token=1e0dda97-6b7c-4cc0-8667-df0f25c4edbd" 
        alt="Not Found"
      >
      <h1>There aren't any pokémons here. You might be looking in the wrong place</h1>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.not-found-container img {
  height: 22rem;
}
</style>