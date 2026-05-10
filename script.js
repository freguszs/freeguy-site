window.addEventListener("load",()=>{

const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];

const pages=$$(".page");
const menu=$("#menuPanel");
const cartPanel=$("#cartPanel");
const quick=$("#quickModal");
const toast=$("#toast");

let cart=[];

// =======================
// LOADER FIX
// =======================

setTimeout(()=>{

  const loader=$("#loader");

  if(loader){

    loader.style.opacity="0";
    loader.style.pointerEvents="none";

    setTimeout(()=>{

      loader.style.display="none";

    },600);

  }

},1200);

// =======================
// NAVIGATION
// =======================

function go(id){

  pages.forEach(p=>{

    p.classList.remove("active");

  });

  const target=document.getElementById(id);

  if(target){

    target.classList.add("active");

  }

}

$$("[data-page]").forEach(btn=>{

  btn.onclick=()=>{

    go(btn.dataset.page);

  };

});

// =======================
// MENU
// =======================

if($("#menuOpen")){

  $("#menuOpen").onclick=()=>{

    menu.classList.add("open");

  };

}

if($("#menuClose")){

  $("#menuClose").onclick=()=>{

    menu.classList.remove("open");

  };

}

// =======================
// CART
// =======================

if($("#cartOpen")){

  $("#cartOpen").onclick=()=>{

    cartPanel.classList.add("open");

  };

}

if($("#cartClose")){

  $("#cartClose").onclick=()=>{

    cartPanel.classList.remove("open");

  };

}

// =======================
// TOAST
// =======================

function showToast(text){

  if(!toast) return;

  toast.textContent=text;

  toast.classList.add("show");

  clearTimeout(window.toastTimeout);

  window.toastTimeout=setTimeout(()=>{

    toast.classList.remove("show");

  },1600);

}

// =======================
// RENDER CART
// =======================

function renderCart(){

  const count=$("#cartCount");
  const total=$("#cartTotal");
  const items=$("#cartItems");

  if(count){

    count.textContent=
      cart.reduce((a,b)=>a+b.qty,0);

  }

  if(total){

    total.textContent=
      cart.reduce((a,b)=>a+b.qty*b.price,0)+"€";

  }

  if(items){

    items.innerHTML=
      cart.length
      ? cart.map((item,i)=>`

      <div class="cart-row">

        <img src="${item.img}">

        <div>

          <b>${item.name}</b>

          <p>
            ${item.size}
            ·
            ${item.qty}x
            ·
            ${item.price}€
          </p>

        </div>

        <button
          class="remove-btn"
          data-remove="${i}"
        >
          ×
        </button>

      </div>

    `).join("")

      : "<p>Ton panier est vide.</p>";

  }

  $$(".remove-btn").forEach(btn=>{

    btn.onclick=()=>{

      const index=
        parseInt(btn.dataset.remove);

      cart.splice(index,1);

      renderCart();

    };

  });

}

// =======================
// ADD TO CART FIX
// =======================

$$(".add").forEach(btn=>{

  btn.onclick=(e)=>{

    e.preventDefault();

    e.stopPropagation();

    const card=
      btn.closest(".product-card");

    if(!card) return;

    const select=
      card.querySelector("select");

    const item={

      id:card.dataset.id,

      name:card.dataset.name,

      price:Number(card.dataset.price),

      img:
        card.querySelector("img").src,

      size:
        select
        ? select.value
        : "One Size",

      qty:1

    };

    const existing=cart.find(x=>

      x.id===item.id &&
      x.size===item.size

    );

    if(existing){

      existing.qty++;

    } else {

      cart.push(item);

    }

    renderCart();

    cartPanel.classList.add("open");

    showToast(item.name+" ajouté");

    btn.style.transform="scale(.95)";

    setTimeout(()=>{

      btn.style.transform="";

    },150);

  };

});

// =======================
// FAVORITES
// =======================

$$(".favorite").forEach(btn=>{

  btn.onclick=(e)=>{

    e.preventDefault();

    e.stopPropagation();

    btn.classList.toggle("on");

    btn.textContent=
      btn.classList.contains("on")
      ? "♥"
      : "♡";

  };

});

// =======================
// QUICK VIEW
// =======================

$$(".quick").forEach(btn=>{

  btn.onclick=(e)=>{

    e.preventDefault();

    e.stopPropagation();

    const card=
      btn.closest(".product-card");

    if(!card) return;

    const content=
      $("#quickContent");

    if(content){

      content.innerHTML=`

      <div class="quick-layout">

        <img
          src="${card.querySelector("img").src}"
        >

        <div>

          <small>
            QUICK VIEW
          </small>

          <h1>
            ${card.dataset.name}
          </h1>

          <p>
            ${card.querySelector("p").textContent}
          </p>

          <h2>
            ${card.dataset.price}€
          </h2>

          <p>
            Produit FREEGUY premium
            avec direction artistique
            digitale et immersive.
          </p>

        </div>

      </div>

      `;

    }

    if(quick){

      quick.classList.add("open");

    }

  };

});

if($("#quickClose")){

  $("#quickClose").onclick=()=>{

    quick.classList.remove("open");

  };

}

// =======================
// CONTACT
// =======================

if($("#contactForm")){

  $("#contactForm").onsubmit=(e)=>{

    e.preventDefault();

    const status=$("#formStatus");

    if(status){

      status.textContent=
        "Message préparé ✅";

    }

    showToast("Message envoyé");

  };

}

// =======================
// CHECKOUT
// =======================

if($("#checkoutBtn")){

  $("#checkoutBtn").onclick=()=>{

    showToast(
      "Checkout prêt"
    );

  };

}

// =======================
// CURSOR + 3D
// =======================

const cursor=$("#cursor");

window.addEventListener(
  "mousemove",
  (e)=>{

  if(cursor){

    cursor.style.left=
      e.clientX+"px";

    cursor.style.top=
      e.clientY+"px";

  }

  $$(".product-card").forEach(card=>{

    const r=
      card.getBoundingClientRect();

    const x=
      e.clientX-r.left-r.width/2;

    const y=
      e.clientY-r.top-r.height/2;

    const inside=

      e.clientX>r.left &&
      e.clientX<r.right &&

      e.clientY>r.top &&
      e.clientY<r.bottom;

    if(inside){

      card.style.transform=`

        rotateY(${x/28}deg)

        rotateX(${-y/28}deg)

        translateY(-10px)

      `;

    } else {

      card.style.transform="";

    }

  });

});

// =======================
// PARTICLES
// =======================

const canvas=$("#particles");

if(canvas){

  const ctx=
    canvas.getContext("2d");

  let W,H,parts=[];

  function resize(){

    W=
      canvas.width=
      innerWidth;

    H=
      canvas.height=
      innerHeight;

    parts=
      Array.from({

      length:
        innerWidth<700
        ? 45
        : 100

    },()=>({

      x:Math.random()*W,
      y:Math.random()*H,

      vx:
        (Math.random()-.5)*.45,

      vy:
        (Math.random()-.5)*.45,

      r:
        Math.random()*2+1,

      a:
        Math.random()*0.7+0.2

    }));

  }

  resize();

  addEventListener(
    "resize",
    resize
  );

  function draw(){

    ctx.clearRect(0,0,W,H);

    for(const p of parts){

      p.x+=p.vx;
      p.y+=p.vy;

      if(p.x<0||p.x>W)
        p.vx*=-1;

      if(p.y<0||p.y>H)
        p.vy*=-1;

      ctx.beginPath();

      ctx.fillStyle=
        `rgba(
          172,
          100,
          255,
          ${p.a}
        )`;

      ctx.arc(
        p.x,
        p.y,
        p.r,
        0,
        Math.PI*2
      );

      ctx.fill();

    }

    requestAnimationFrame(draw);

  }

  draw();

}

});