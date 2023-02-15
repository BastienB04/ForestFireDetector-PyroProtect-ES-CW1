"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radiusFromFWI = void 0;
function radiusFromFWI(FWI) {
    return -11.242 * FWI + 101.88;
}
exports.radiusFromFWI = radiusFromFWI;
function euclideanDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
function getIntersection2Circles(circle1, circle2) {
    const d = euclideanDistance({ x: circle1.x, y: circle1.y }, { x: circle2.x, y: circle2.y });
    if (d > circle1.r + circle2.r) {
        return null;
    }
    if (d < Math.abs(circle1.r - circle2.r)) {
        return null;
    }
    if (d === 0 && circle1.r === circle2.r) {
        return null;
    }
    const a = (circle1.r ** 2 - circle2.r ** 2 + d ** 2) / (2 * d);
    const h = Math.sqrt(circle1.r ** 2 - a ** 2);
    const x2 = circle1.x + a * (circle2.x - circle1.x) / d;
    const y2 = circle1.y + a * (circle2.y - circle1.y) / d;
    const x3 = x2 + h * (circle2.y - circle1.y) / d;
    const y3 = y2 - h * (circle2.x - circle1.x) / d;
    const x4 = x2 - h * (circle2.y - circle1.y) / d;
    const y4 = y2 + h * (circle2.x - circle1.x) / d;
    const point1 = { x: x3, y: y3 };
    const point2 = { x: x4, y: y4 };
    return [point1, point2];
}
function numberOfIntersections(circle1, circle2) {
    const v = getIntersection2Circles(circle1, circle2);
    if (v === null) {
        return 0;
    }
    else {
        return v.length;
    }
}
function containment2Circles(circle1, circle2) {
    const d = Math.sqrt((circle2.x - circle1.x) ** 2 + (circle2.y - circle1.y) ** 2);
    const numOfIntersections = numberOfIntersections(circle1, circle2);
    if (d < Math.abs(circle1.r - circle2.r) && circle1.r < circle2.r && numOfIntersections === 0) {
        return 1;
    }
    else {
        return 0;
    }
}
function pointInCircle(point, circle) {
    if ((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2 < circle.r ** 2) {
        return 1;
    }
    else {
        return 0;
    }
}
function determineOverlapCase_intermediate(circle1, circle2, circle3) {
    const _1_containedIn_2 = containment2Circles(circle1, circle2);
    const _1_containedIn_3 = containment2Circles(circle1, circle3);
    const _2_containedIn_1 = containment2Circles(circle2, circle1);
    const _2_containedIn_3 = containment2Circles(circle2, circle3);
    const _3_containedIn_1 = containment2Circles(circle3, circle1);
    const _3_containedIn_2 = containment2Circles(circle3, circle2);
    const intersections_between_1and2 = numberOfIntersections(circle1, circle2);
    const intersections_between_1and3 = numberOfIntersections(circle1, circle3);
    const intersections_between_2and3 = numberOfIntersections(circle2, circle3);
    const conditions = [_1_containedIn_2, _1_containedIn_3, _2_containedIn_1, _2_containedIn_3, _3_containedIn_1, _3_containedIn_2, intersections_between_1and2, intersections_between_1and3, intersections_between_2and3];
    let Case = 0;
    if (conditions.join('') === '000000000') {
        Case = 1;
    }
    else if (conditions.join('') === '000000020') {
        Case = 2;
    }
    else if (conditions.join('') === '100000000') {
        Case = 3;
    }
    else if (conditions.join('') === '110100000') {
        Case = 4;
    }
    else if (conditions.join('') === '010100020') {
        Case = 5;
    }
    else if (conditions.join('') === '010100000') {
        Case = 6;
    }
    else if (conditions.join('') === '000000002') {
        Case = 7;
    }
    else if (conditions.join('') === '000000222') {
        const intersections_1and2 = getIntersection2Circles(circle1, circle2);
        const intersections_1and3 = getIntersection2Circles(circle1, circle3);
        const intersections_2and3 = getIntersection2Circles(circle2, circle3);
        if (pointInCircle(intersections_1and2[0], circle3) === 0 &&
            pointInCircle(intersections_1and2[1], circle3) === 0 &&
            pointInCircle(intersections_2and3[0], circle1) === 0 &&
            pointInCircle(intersections_2and3[1], circle1) === 0) {
            if (pointInCircle(intersections_1and3[0], circle2) === 0 &&
                pointInCircle(intersections_1and3[1], circle2) === 0) {
                Case = 9;
            }
            else {
                Case = 14;
            }
        }
        else if (pointInCircle(intersections_1and2[0], circle3) === 1 &&
            pointInCircle(intersections_1and2[1], circle3) === 1 &&
            pointInCircle(intersections_1and3[0], circle2) === 1 &&
            pointInCircle(intersections_1and3[1], circle2) === 1 &&
            pointInCircle(intersections_2and3[0], circle1) === 0 &&
            pointInCircle(intersections_2and3[1], circle1) === 0) {
            Case = 13;
        }
        else {
            Case = 8;
        }
    }
    else if (conditions.join('') === '100000002') {
        Case = 10;
    }
    else if (conditions.join('') === '100000022') {
        Case = 11;
    }
    else if (conditions.join('') === '110000002') {
        Case = 12;
    }
    else {
        Case = 0;
    }
    return Case;
}
function determineOverlapCase(circle1, circle2, circle3) {
    let Case = determineOverlapCase_intermediate(circle1, circle2, circle3);
    let circle_config = 1;
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle1, circle3, circle2);
        circle_config = 2;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle2, circle1, circle3);
        circle_config = 3;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle3, circle1, circle2);
        circle_config = 4;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle2, circle3, circle1);
        circle_config = 5;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle3, circle2, circle1);
        circle_config = 6;
    }
    return [Case, circle_config];
}
function area_circle(circle) {
    const A = Math.PI * Math.pow(circle.r, 2);
    return A;
}
function area_overlap_2circles(circle1, circle2) {
    const intersections = getIntersection2Circles(circle1, circle2);
    const d = euclideanDistance(intersections[0], intersections[1]);
    const r1 = circle1.r;
    const theta1 = Math.acos((2 * Math.pow(r1, 2) - Math.pow(d, 2)) / (2 * Math.pow(r1, 2)));
    const a_sect1 = (theta1 / (2 * Math.PI)) * Math.PI * Math.pow(r1, 2);
    const a_tri1 = 0.5 * Math.pow(r1, 2) * Math.sin(theta1);
    const a_seg1 = a_sect1 - a_tri1;
    const r2 = circle2.r;
    const theta2 = Math.acos((2 * Math.pow(r2, 2) - Math.pow(d, 2)) / (2 * Math.pow(r2, 2)));
    const a_sect2 = (theta2 / (2 * Math.PI)) * Math.PI * Math.pow(r2, 2);
    const a_tri2 = 0.5 * Math.pow(r2, 2) * Math.sin(theta2);
    const a_seg2 = a_sect2 - a_tri2;
    return a_seg1 + a_seg2;
}
function areas_case1(circle1, circle2, circle3) {
    const A1 = area_circle(circle1);
    const A2 = area_circle(circle2);
    const A3 = area_circle(circle3);
    return [[A1, A2, A3, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];
}
function areas_case2(circle1, circle2, circle3) {
    const yellow_1and2 = area_overlap_2circles(circle1, circle2);
    const yellow_1and3 = area_overlap_2circles(circle2, circle3);
    let green1 = area_circle(circle1);
    green1 -= yellow_1and2;
    let green2 = area_circle(circle2);
    green2 -= yellow_1and2 + yellow_1and3;
    let green3 = area_circle(circle3);
    green3 -= yellow_1and3;
    const total_yellow = yellow_1and2 + yellow_1and3;
    const total_green = green1 + green2 + green3;
    return [[green1, green2, green3, 0],
        [yellow_1and2, yellow_1and3, 0, 0],
        [0, 0, 0, 0]];
}
function areas_case3(circle1, circle2, circle3) {
    const yellow = area_circle(circle1);
    let green1 = area_circle(circle2);
    green1 -= yellow;
    const green2 = area_circle(circle3);
    return [
        [green1, green2, 0, 0],
        [yellow, 0, 0, 0],
        [0, 0, 0, 0]
    ];
}
function areas_case4(circle1, circle2, circle3) {
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const a3 = area_circle(circle3);
    const red = a1;
    const yellow = a2 - a1;
    const green = a3 - a2;
    return [
        [green, 0, 0, 0],
        [yellow, 0, 0, 0],
        [red, 0, 0, 0]
    ];
}
function areas_case5(circle1, circle2, circle3) {
    const red = area_overlap_2circles(circle1, circle2);
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const yellow1 = a1 - red;
    const yellow2 = a2 - red;
    let green = area_circle(circle3) - yellow1 - yellow2 - red;
    return [
        [green, 0, 0, 0],
        [yellow1, yellow2, 0, 0],
        [red, 0, 0, 0]
    ];
}
function areas_case6(circle1, circle2, circle3) {
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const green = area_circle(circle3) - a1 - a2;
    return [
        [green, 0, 0, 0],
        [a1, a2, 0, 0],
        [0, 0, 0, 0]
    ];
}
function areas_case7(circle1, circle2, circle3) {
    const yellow = area_overlap_2circles(circle2, circle3);
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2) - yellow;
    const a3 = area_circle(circle3) - yellow;
    return [
        [a1, a2, a3, 0],
        [yellow, 0, 0, 0],
        [0, 0, 0, 0]
    ];
}
function areas_case8(circle1, circle2, circle3) {
    const intersections_1and2 = getIntersection2Circles(circle1, circle2);
    const intersections_1and3 = getIntersection2Circles(circle1, circle3);
    const intersections_2and3 = getIntersection2Circles(circle2, circle3);
    let polygon_vertex_a, polygon_vertex_b, polygon_vertex_c;
    if (pointInCircle(intersections_1and2[0], circle3) === 0) {
        polygon_vertex_a = intersections_1and2[1];
    }
    else if (pointInCircle(intersections_1and2[1], circle3) === 0) {
        polygon_vertex_a = intersections_1and2[0];
    }
    if (pointInCircle(intersections_1and3[0], circle2) === 0) {
        polygon_vertex_b = intersections_1and3[1];
    }
    else if (pointInCircle(intersections_1and3[1], circle2) === 0) {
        polygon_vertex_b = intersections_1and3[0];
    }
    if (pointInCircle(intersections_2and3[0], circle1) === 0) {
        polygon_vertex_c = intersections_2and3[1];
    }
    else if (pointInCircle(intersections_2and3[1], circle1) === 0) {
        polygon_vertex_c = intersections_2and3[0];
    }
    const polygon_side_a = euclideanDistance(polygon_vertex_a, polygon_vertex_b);
    const polygon_side_b = euclideanDistance(polygon_vertex_a, polygon_vertex_c);
    const polygon_side_c = euclideanDistance(polygon_vertex_b, polygon_vertex_c);
    const angle = Math.acos((polygon_side_b ** 2 + polygon_side_c ** 2 - polygon_side_a ** 2) / (2 * polygon_side_b * polygon_side_c));
    const polygon_area = 0.5 * polygon_side_b * polygon_side_c * Math.sin(angle);
    const angle1 = Math.acos((circle1.r ** 2 + circle1.r ** 2 - polygon_side_a ** 2) / (2 * (circle1.r ** 2)));
    const area_sector1 = (angle1 / (2 * Math.PI)) * Math.PI * (circle1.r ** 2);
    const area_triangle1 = 0.5 * (circle1.r ** 2) * Math.sin(angle1);
    const area_segment1 = area_sector1 - area_triangle1;
    const angle2 = Math.acos((circle2.r ** 2 + circle2.r ** 2 - polygon_side_b ** 2) / (2 * (circle2.r ** 2)));
    const area_sector2 = (angle2 / (2 * Math.PI)) * Math.PI * (circle2.r ** 2);
    const area_triangle2 = 0.5 * (circle2.r ** 2) * Math.sin(angle2);
    const area_segment2 = area_sector2 - area_triangle2;
    const angle3 = Math.acos((circle3.r ** 2 + circle3.r ** 2 - polygon_side_b ** 2) / (2 * (circle3.r ** 2)));
    const area_sector3 = (angle3 / (2 * Math.PI)) * Math.PI * (circle3.r ** 2);
    const area_triangle3 = 0.5 * (circle3.r ** 2) * Math.sin(angle3);
    const area_segment3 = area_sector3 - area_triangle3;
    const red = polygon_area + area_segment1 + area_segment2 + area_segment3;
    const i1and2 = area_overlap_2circles(circle1, circle2);
    const i1and3 = area_overlap_2circles(circle1, circle3);
    const i2and3 = area_overlap_2circles(circle2, circle3);
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const a3 = area_circle(circle3);
    const yellow1 = i1and2 - red;
    const yellow2 = i2and3 - red;
    const yellow3 = i1and3 - red;
    const green1 = a1 - (yellow1 + yellow3 + red);
    const green2 = a2 - (yellow1 + yellow2 + red);
    const green3 = a3 - (yellow2 + yellow3 + red);
    return [
        [green1, green2, green3, 0],
        [yellow1, yellow2, yellow3, 0],
        [red, 0, 0, 0]
    ];
}
function areas_case9(circle1, circle2, circle3) {
    const y1 = area_overlap_2circles(circle1, circle2);
    const y2 = area_overlap_2circles(circle2, circle3);
    const y3 = area_overlap_2circles(circle1, circle3);
    const a1 = area_circle(circle1) - y1 - y3;
    const a2 = area_circle(circle2) - y1 - y2;
    const a3 = area_circle(circle3) - y2 - y3;
    return [
        [a1, a2, a3, 0],
        [y1, y2, y3, 0],
        [0, 0, 0, 0]
    ];
}
function areas_case10(circle1, circle2, circle3) {
    const y1 = area_circle(circle1);
    const y2 = area_overlap_2circles(circle2, circle3);
    const g1 = area_circle(circle2) - y1 - y2;
    const g2 = area_circle(circle3) - y2;
    return [
        [g1, g2, 0, 0],
        [y1, y2, 0, 0],
        [0, 0, 0, 0]
    ];
}
function area_case11(circle1, circle2, circle3) {
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const a3 = area_circle(circle3);
    const i1and3 = area_overlap_2circles(circle1, circle3);
    const i2and3 = area_overlap_2circles(circle2, circle3);
    const red = i1and3;
    const y1 = a1 - red;
    const y2 = i2and3 - red;
    const g1 = a2 - (y1 + y2 + red);
    const g2 = a3 - (y2 + red);
    return [
        [g1, g2, 0, 0],
        [y1, y2, 0, 0],
        [red, 0, 0, 0]
    ];
}
function area_case12(circle1, circle2, circle3) {
    const red = area_circle(circle1);
    let yellow = area_overlap_2circles(circle2, circle3);
    const green1 = area_circle(circle2) - yellow;
    const green2 = area_circle(circle3) - yellow;
    yellow -= red;
    return [
        [green1, green2, 0, 0],
        [yellow, 0, 0, 0],
        [red, 0, 0, 0]
    ];
}
