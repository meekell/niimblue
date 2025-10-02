// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/project/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var getDate = () => {
  const date = /* @__PURE__ */ new Date();
  const fmt = (n) => n > 9 ? n : `0${n}`;
  return `${date.getFullYear()}-${fmt(date.getMonth() + 1)}-${fmt(date.getDate())}`;
};
var vite_config_default = defineConfig({
  plugins: [svelte()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __APP_COMMIT__: JSON.stringify(process.env.COMMIT_HASH),
    __BUILD_DATE__: JSON.stringify(getDate())
  },
  optimizeDeps: {
    include: ["@mmote/niimbluelib"]
    // Fix browser error when using `npm link @mmote/niimbluelib`
  },
  resolve: {
    preserveSymlinks: true
    // Fix build error when using `npm link @mmote/niimbluelib`
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.endsWith(".css") || id.endsWith(".scss")) {
            return "style";
          }
          if (id.includes("node_modules")) {
            if (id.includes("fabric")) {
              return "lib.2.fabric";
            } else if (id.includes("@capacitor/filesystem") || id.includes("@capacitor/share")) {
              return "lib.2.cap";
            } else if (id.includes("zod")) {
              return "lib.2.zod";
            } else if (id.includes("@mmote/niimbluelib")) {
              return "lib.2.niim";
            }
            return "lib.1.other";
          }
          return null;
        },
        chunkFileNames: () => {
          return "assets/[name].[hash].js";
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIjtcblxuY29uc3QgZ2V0RGF0ZSA9ICgpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgY29uc3QgZm10ID0gKG46IG51bWJlcikgPT4gKG4gPiA5ID8gbiA6IGAwJHtufWApO1xuICByZXR1cm4gYCR7ZGF0ZS5nZXRGdWxsWWVhcigpfS0ke2ZtdChkYXRlLmdldE1vbnRoKCkgKyAxKX0tJHtmbXQoZGF0ZS5nZXREYXRlKCkpfWA7XG59O1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3N2ZWx0ZSgpXSxcbiAgZGVmaW5lOiB7XG4gICAgX19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcbiAgICBfX0FQUF9DT01NSVRfXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuQ09NTUlUX0hBU0gpLFxuICAgIF9fQlVJTERfREFURV9fOiBKU09OLnN0cmluZ2lmeShnZXREYXRlKCkpLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXCJAbW1vdGUvbmlpbWJsdWVsaWJcIl0sIC8vIEZpeCBicm93c2VyIGVycm9yIHdoZW4gdXNpbmcgYG5wbSBsaW5rIEBtbW90ZS9uaWltYmx1ZWxpYmBcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIHByZXNlcnZlU3ltbGlua3M6IHRydWUsIC8vIEZpeCBidWlsZCBlcnJvciB3aGVuIHVzaW5nIGBucG0gbGluayBAbW1vdGUvbmlpbWJsdWVsaWJgXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAoaWQuZW5kc1dpdGgoXCIuY3NzXCIpIHx8IGlkLmVuZHNXaXRoKFwiLnNjc3NcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBcInN0eWxlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwibm9kZV9tb2R1bGVzXCIpKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJmYWJyaWNcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwibGliLjIuZmFicmljXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlkLmluY2x1ZGVzKFwiQGNhcGFjaXRvci9maWxlc3lzdGVtXCIpIHx8IGlkLmluY2x1ZGVzKFwiQGNhcGFjaXRvci9zaGFyZVwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJsaWIuMi5jYXBcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaWQuaW5jbHVkZXMoXCJ6b2RcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwibGliLjIuem9kXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlkLmluY2x1ZGVzKFwiQG1tb3RlL25paW1ibHVlbGliXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcImxpYi4yLm5paW1cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFwibGliLjEub3RoZXJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFwiYXNzZXRzL1tuYW1lXS5baGFzaF0uanNcIjtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxTQUFTLGNBQWM7QUFFdkIsSUFBTSxVQUFVLE1BQWM7QUFDNUIsUUFBTSxPQUFPLG9CQUFJLEtBQUs7QUFDdEIsUUFBTSxNQUFNLENBQUMsTUFBZSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUM7QUFDN0MsU0FBTyxHQUFHLEtBQUssWUFBWSxDQUFDLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUM7QUFDakY7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsT0FBTyxDQUFDO0FBQUEsRUFDbEIsUUFBUTtBQUFBLElBQ04saUJBQWlCLEtBQUssVUFBVSxRQUFRLElBQUksbUJBQW1CO0FBQUEsSUFDL0QsZ0JBQWdCLEtBQUssVUFBVSxRQUFRLElBQUksV0FBVztBQUFBLElBQ3RELGdCQUFnQixLQUFLLFVBQVUsUUFBUSxDQUFDO0FBQUEsRUFDMUM7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxvQkFBb0I7QUFBQTtBQUFBLEVBQ2hDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxrQkFBa0I7QUFBQTtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjLENBQUMsT0FBZTtBQUM1QixjQUFJLEdBQUcsU0FBUyxNQUFNLEtBQUssR0FBRyxTQUFTLE9BQU8sR0FBRztBQUMvQyxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsZ0JBQUksR0FBRyxTQUFTLFFBQVEsR0FBRztBQUN6QixxQkFBTztBQUFBLFlBQ1QsV0FBVyxHQUFHLFNBQVMsdUJBQXVCLEtBQUssR0FBRyxTQUFTLGtCQUFrQixHQUFHO0FBQ2xGLHFCQUFPO0FBQUEsWUFDVCxXQUFXLEdBQUcsU0FBUyxLQUFLLEdBQUc7QUFDN0IscUJBQU87QUFBQSxZQUNULFdBQVcsR0FBRyxTQUFTLG9CQUFvQixHQUFHO0FBQzVDLHFCQUFPO0FBQUEsWUFDVDtBQUVBLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0EsZ0JBQWdCLE1BQU07QUFDcEIsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
