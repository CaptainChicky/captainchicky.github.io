"use strict";

const CTX = document.getElementsByTagName("canvas")[0].getContext("2d", {alpha: true});
const ZOOM = document.getElementById("zoom");
const REL = document.getElementById("rel");

class ECS {
    constructor() {
        this.entity_counter = 0;
        this.components_map = new Map();
    }

    create_entity(template = {}) {
        let entity = this.entity_counter++;
        for (let [component, value] of Object.entries(template))
            this.set_component(entity, component, value);
        return entity;
    }

    set_component(entity, component, value) {
        let map = this.components_map.get(component);
        // Create the component map if it does not exist.
        if (map === undefined) {
            map = new Map();
            this.components_map.set(component, map);
        }
        map.set(entity, value);
    }

    get_component(entity, component) {
        return this.components_map.get(component).get(entity);
    }

    get_entities_having_components(first_component, ...components) {
        let entities = new Set(this.components_map.get(first_component).keys());
        for (let component of components) {
            entities = new Set([...entities].filter(entity => this.components_map.get(component).has(entity)));
        }
        return [...entities].sort();
    }
}

function norm([x, y]) {
    return Math.sqrt(x * x + y * y);
}

function scale(s, [x, y]) {
    return [s * x, s * y];
}

function normalize(v) {
    return scale(1.0 / norm(v), v);
}

function add([x1, y1], [x2, y2]) {
    return [x1 + x2, y1 + y2];
}

function sub([x1, y1], [x2, y2]) {
    return [x1 - x2, y1 - y2];
}

function rotate([x, y], radians) {
    let c = Math.cos(radians);
    let s = Math.sin(radians);
    return [x * c - y * s, x * s + y * c];
}

function dot([x1, y1], [x2, y2]) {
    return x1 * x2 + y1 * y2;
}

class Occupancy {
    constructor(gridsize) {
        this.x = new Map();
        this.y = new Map();
        this.gridsize = gridsize;
    }

    add(value, xmin, xmax, ymin, ymax) {
        for (let x = Math.floor(xmin / this.gridsize); x <= Math.floor(xmax / this.gridsize); x++) {
            if (!this.x.has(x))
                this.x.set(x, new Set());
            this.x.get(x).add(value);
        }
        for (let y = Math.floor(ymin / this.gridsize); y <= Math.floor(ymax / this.gridsize); y++) {
            if (!this.y.has(y))
                this.y.set(y, new Set());
            this.y.get(y).add(value);
        }
    }

    remove(value, xmin, xmax, ymin, ymax) {
        for (let x = Math.floor(xmin / this.gridsize); x <= Math.floor(xmax / this.gridsize); x++) {
            let map = this.x.get(x);
            if (map !== undefined) {
                map.delete(value);
                if (map.size === 0)
                    this.x.delete(x);
            }
        }
        for (let y = Math.floor(ymin / this.gridsize); y <= Math.floor(ymax / this.gridsize); y++) {
            let map = this.y.get(y);
            if (map !== undefined) {
                map.delete(value);
                if (map.size === 0)
                    this.y.delete(y);
            }
        }
    }

    near(xmin, xmax, ymin, ymax) {
        let xset = new Set();
        for (let x = Math.floor(xmin / this.gridsize); x <= Math.floor(xmax / this.gridsize); x++) {
            for (let value of this.x.get(x) || [])
                xset.add(value)
        }
        let result = new Set();
        for (let y = Math.floor(ymin / this.gridsize); y <= Math.floor(ymax / this.gridsize); y++) {
            for (let value of this.y.get(y) || []) {
                if (xset.has(value))
                    result.add(value);
            }
        }
        return result;
    }
}

const ecs = new ECS();

const OCCUPANCY = new Occupancy(10.0);

const DAMPING = 0.6;

const ARENA_RADIUS = 50.0;

function ai_one(entity, enemy, protector) {
    let entity_phys = ecs.get_component(entity, "phys");
    let enemy_phys = ecs.get_component(enemy, "phys");
    let protector_phys = ecs.get_component(protector, "phys");
    let entity_pos_rel = sub(entity_phys.pos, protector_phys.pos);
    let enemy_pos_rel = sub(enemy_phys.pos, protector_phys.pos);
    if (dot(entity_pos_rel, enemy_pos_rel) >= 0) {
        // Try to move to the opposite side of the plane.
        entity_phys.force = normalize(scale(-1, enemy_pos_rel));
    } else {
        let proj = scale(dot(entity_pos_rel, enemy_pos_rel) / norm(enemy_pos_rel), normalize(enemy_pos_rel));
        entity_phys.force = sub(proj, entity_pos_rel);
        if (norm(entity_phys.force) > 0.1)
            entity_phys.force = normalize(sub(proj, entity_pos_rel));
        else
            entity_phys.force = [0.0, 0.0];
    }
}

function ai() {
    for (let entity of ecs.get_entities_having_components("phys", "enemy", "protector"))
        ai_one(entity, ecs.get_component(entity, "enemy"), ecs.get_component(entity, "protector"));
}

function bounding_box(phys) {
    return [phys.pos[0] - phys.radius, phys.pos[0] + phys.radius, phys.pos[1] - phys.radius, phys.pos[1] + phys.radius];
}

function* collisions(phys) {
    for (let other of OCCUPANCY.near(...bounding_box(phys))) {
        let other_phys = ecs.get_component(other, "phys");
        if (norm(sub(phys.pos, other_phys.pos)) < phys.radius + other_phys.radius)
            yield other;
    }
}

function any_collisions(phys) {
    for (let _ of collisions(phys))
        return true;
    return false;
}

function physics(dt) {
    for (let entity of ecs.get_entities_having_components("phys")) {
        let phys = ecs.get_component(entity, "phys");
        for (let other of collisions(phys)) {
            if (other === entity)
                continue;
            let other_phys = ecs.get_component(other, "phys");
            let v = sub(phys.pos, other_phys.pos);
            let p = phys.radius + other_phys.radius - norm(v);
            let mass = phys.radius * phys.radius;
            let other_mass = other_phys.radius * other_phys.radius;
            let m = 10 /* ??? */ * other_mass / (mass + other_mass) / ((other_phys.radius - p) * (other_phys.radius - p));
            phys.force = add(phys.force, scale(m, normalize(v)));
        }
        phys.force = sub(phys.force, scale(DAMPING, phys.vel));
    }
    // Keep everyone in a circular arena.
    for (let entity of ecs.get_entities_having_components("phys")) {
        let phys = ecs.get_component(entity, "phys");
        let p = norm(phys.pos) - ARENA_RADIUS;
        if (p > 0)
            phys.force = add(phys.force, scale(-p * 0.05 /* ??? */, phys.pos));
    }
    for (let entity of ecs.get_entities_having_components("phys")) {
        let phys = ecs.get_component(entity, "phys");
        OCCUPANCY.remove(entity, ...bounding_box(phys));
        let mass = phys.radius * phys.radius;
        let acc = scale(1.0 / mass, phys.force);
        phys.vel[0] += acc[0] * dt;
        phys.vel[1] += acc[1] * dt;
        phys.pos[0] += phys.vel[0] * dt;
        phys.pos[1] += phys.vel[1] * dt;
        OCCUPANCY.add(entity, ...bounding_box(phys));
    }
}

function draw_arrow(start, end) {
        CTX.moveTo(...start);
        CTX.lineTo(...end);
        let n = normalize(sub(end, start));
        CTX.moveTo(...(sub(end, rotate(n, -Math.PI/8))));
        CTX.lineTo(...end);
        CTX.lineTo(...(sub(end, rotate(n, +Math.PI/8))));
}

function draw() {
    CTX.save();
    CTX.clearRect(0, 0, CTX.canvas.width, CTX.canvas.height);
    CTX.translate(CTX.canvas.width / 2, CTX.canvas.height / 2);
    CTX.scale(1.0, -1.0);
    let zoom = Math.pow(10, ZOOM.value);
    CTX.scale(zoom, zoom);

    CTX.beginPath()
    CTX.arc(0, 0, ARENA_RADIUS, 0, 2 * Math.PI);
    CTX.closePath();
    CTX.lineWidth = 0.2;
    CTX.strokeStyle = "#8888";
    CTX.stroke();

    for (let entity of ecs.get_entities_having_components("phys", "enemy", "protector")) {
        let phys = ecs.get_component(entity, "phys");

        CTX.fillStyle = phys.color;
        CTX.beginPath();
        CTX.arc(...phys.pos, phys.radius, 0, 2 * Math.PI);
        CTX.closePath();
        CTX.fill();

        /*
        CTX.strokeStyle = "yellow";
        CTX.lineWidth = 0.2;
        CTX.beginPath();
        CTX.moveTo(...phys.pos);
        CTX.lineTo(...add(phys.pos, phys.force));
        CTX.stroke();
        */

        if (REL.checked) {
            let enemy_phys = ecs.get_component(ecs.get_component(entity, "enemy"), "phys");
            let protector_phys = ecs.get_component(ecs.get_component(entity, "protector"), "phys");
            CTX.strokeStyle = "red";
            CTX.beginPath();
            draw_arrow(phys.pos, enemy_phys.pos);
            CTX.stroke();
            CTX.strokeStyle = "dodgerblue";
            CTX.beginPath();
            draw_arrow(phys.pos, protector_phys.pos);
            CTX.stroke();
        }
    }

    /*
    CTX.fillStyle = "#8888";
    CTX.beginPath();
    for (let x of OCCUPANCY.x.keys()) {
        if (OCCUPANCY.x.get(x).size === 0)
            continue;
        CTX.rect(x * OCCUPANCY.gridsize, -1000, OCCUPANCY.gridsize, +2000);
    }
    CTX.fill();
    CTX.beginPath();
    for (let y of OCCUPANCY.y.keys()) {
        if (OCCUPANCY.y.get(y).size === 0)
            continue;
        CTX.rect(-1000, y * OCCUPANCY.gridsize, +2000, OCCUPANCY.gridsize);
    }
    CTX.fill();
    */

    CTX.restore();
}

let entities = [];
for (let i = 0; i < 50; i++) {
    let phys;
    do {
        phys = {
            pos: [Math.random() * 50 - 25, Math.random() * 50 - 25],
            vel: [0, 0],
            force: [0, 0],
            radius: Math.sqrt(Math.random() * 3.0 + 1.0),
            color: "black",
        };
    } while (any_collisions(phys));
    let entity = ecs.create_entity({phys});
    entities.push(entity);
    OCCUPANCY.add(entity, ...bounding_box(phys));
}
for (let entity of entities) {
    let enemy, protector;
    do {
        enemy = entities[Math.floor(Math.random() * entities.length)];
    } while (enemy === entity);
    do {
        protector = entities[Math.floor(Math.random() * entities.length)];
    } while (protector === entity || protector === enemy);
    ecs.set_component(entity, "enemy", enemy);
    ecs.set_component(entity, "protector", protector);
}

/*
let a = ecs.create_entity({
    phys: {
        pos: [2.0, -6.0],
        vel: [0.0, 0.0],
        force: [0.0, 0.0],
        radius: 1,
        color: "red",
    },
});
let b = ecs.create_entity({
    phys: {
        pos: [-1.0, 1.0],
        vel: [0.0, 0.0],
        force: [0.0, 0.0],
        radius: 1,
        color: "blue",
    },
});
let c = ecs.create_entity({
    phys: {
        pos: [-4.0, -20.0],
        vel: [0.0, 0.0],
        force: [0.0, 0.0],
        radius: 2,
        color: "green",
    },
});
ecs.set_component(a, "enemy", b);
ecs.set_component(a, "protector", c);
ecs.set_component(b, "enemy", c);
ecs.set_component(b, "protector", a);
ecs.set_component(c, "enemy", a);
ecs.set_component(c, "protector", b);
*/

/*
let enemy = ecs.create_entity({
    phys: {
        pos: [2.0, -6.0],
        vel: [0.0, 0.0],
        force: [0.0, 0.0],
        radius: 1,
        color: "red",
    },
});
let protector = ecs.create_entity({
    phys: {
        pos: [-1.0, 1.0],
        vel: [0.0, 0.0],
        force: [0.0, 0.0],
        radius: 1,
        color: "blue",
    },
});
let hero = ecs.create_entity({
    phys: {
        pos: [-4.0, -20.0],
        vel: [0.0, 0.0],
        force: [0.0, 0.0],
        radius: 1,
        color: "black",
    },
    enemy: enemy,
    protector: protector,
});
ecs.create_entity({
    phys: {
        pos: [15.0, +20.0],
        vel: [0.0, 0.0],
        force: [0.0, 0.0],
        radius: 2,
        color: "black",
    },
    enemy: enemy,
    protector: protector,
});
*/

{
    let prev_timestamp;

    function update(timestamp) {
        let dt = Math.min(0.1, (timestamp - prev_timestamp) / 1000.0);
        prev_timestamp = timestamp;

        for (let i = 0; i < 5; i++) {
            ai();
            physics(dt);
        }
        draw();

        window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(timestamp => {
        prev_timestamp = timestamp;
        window.requestAnimationFrame(update);
    });
}
