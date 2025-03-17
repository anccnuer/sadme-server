import { Application, Router, send } from "jsr:@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
const kv = await Deno.openKv();
async function WordCount(word) {
    const date = getDate();
    const key = [date, word];
    const entry = await kv.get(key);
    if (entry.value == null) {
        await kv.set(key, 1);
        return 1;
    } else {
        await kv.set(key, entry.value + 1);
        return entry.value + 1;
    }
}
function getDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

async function getWordCounts(date) {
    const entries = kv.list({ prefix: [date] });
    const results = {};
    for await (const entry of entries) {
        const word = entry.key[1];
        results[word] = entry.value;
    }
    return results;
}

let word = [
    "操",
    "想死",
    "难受",
    "恶心",
    "血怒",
]
const app = new Application();
const router = new Router();
app.use(async (ctx, next) => {
    try {
        await send(ctx, ctx.request.url.pathname, {
            root: `${Deno.cwd()}/public`,
            index: "index.html",
        });
    } catch (err) {
        await next();
    }
});

router.get("/AllCount", async (ctx) => {
    const date = getDate();
    let counts = await getWordCounts(date);
    ctx.response.body = counts;
});

router.all("/count/:item", async (ctx) => {
    let ci = ctx.params.item;
    let res = '';
    if (word.includes(ci)) {
        res = await WordCount(ci);
    }
    ctx.response.body = `${ctx.params.item} count: ${res}`;
})


app.use(
    oakCors({
        origin: "*",
    }),
);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 3000 });
