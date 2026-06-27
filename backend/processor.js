const { isValidNode } = require("./utils");

function processHierarchy(data) {

    const invalid_entries = [];
    const duplicate_edges = [];

    const graph = {};
    const indegree = {};
    const parentOf = {};

    const seenEdges = new Set();

    // ------------------------
    // Validation + Graph Build
    // ------------------------

    for (let edge of data) {

        if (typeof edge !== "string") {
            invalid_entries.push(edge);
            continue;
        }

        edge = edge.trim();

        if (!isValidNode(edge)) {
            invalid_entries.push(edge);
            continue;
        }

        if (seenEdges.has(edge)) {

            if (!duplicate_edges.includes(edge))
                duplicate_edges.push(edge);

            continue;
        }

        seenEdges.add(edge);

        const [parent, child] = edge.split("->");

        // Multi-parent case
        if (parentOf[child]) {
            continue;
        }

        parentOf[child] = parent;

        if (!graph[parent]) graph[parent] = [];
        if (!graph[child]) graph[child] = [];

        graph[parent].push(child);

        indegree[parent] = indegree[parent] || 0;
        indegree[child] = (indegree[child] || 0) + 1;
    }

    // ------------------------
    // Connected Components
    // ------------------------

    const undirected = {};

    for (const node in graph) {

        if (!undirected[node])
            undirected[node] = [];

        for (const child of graph[node]) {

            undirected[node].push(child);

            if (!undirected[child])
                undirected[child] = [];

            undirected[child].push(node);
        }
    }

    const visited = new Set();
    const components = [];

    function dfsComponent(node, component) {

        visited.add(node);
        component.push(node);

        for (const next of undirected[node]) {

            if (!visited.has(next))
                dfsComponent(next, component);

        }

    }

    for (const node in undirected) {

        if (!visited.has(node)) {

            const component = [];

            dfsComponent(node, component);

            components.push(component);
        }

    }

    // ------------------------
    // Helper Functions
    // ------------------------

    function findRoot(component) {

        const roots = component.filter(
            node => (indegree[node] || 0) === 0
        );

        if (roots.length === 0)
            return component.sort()[0];

        roots.sort();

        return roots[0];
    }

    function detectCycle(start) {

        const visited = new Set();
        const path = new Set();

        function dfs(node) {

            visited.add(node);
            path.add(node);

            for (const child of graph[node]) {

                if (!visited.has(child)) {

                    if (dfs(child))
                        return true;

                } else if (path.has(child)) {

                    return true;

                }

            }

            path.delete(node);

            return false;
        }

        return dfs(start);
    }

    function buildTree(node) {

        const tree = {};

        tree[node] = {};

        for (const child of graph[node]) {
            Object.assign(tree[node], buildTree(child));
        }

        return tree;
    }

    function calculateDepth(node) {

        if (graph[node].length === 0)
            return 1;

        let max = 0;

        for (const child of graph[node]) {
            max = Math.max(max, calculateDepth(child));
        }

        return max + 1;
    }

    const hierarchies = [];

    let totalTrees = 0;
    let totalCycles = 0;

    let largestTreeRoot = "";
    let largestDepth = 0;

   for (const component of components) {

    const root = findRoot(component);

    if (detectCycle(root)) {

        totalCycles++;

        hierarchies.push({
            root,
            tree: {},
            has_cycle: true
        });

        continue;
    }

    const tree = buildTree(root);
    const depth = calculateDepth(root);

    totalTrees++;

    if (
        depth > largestDepth ||
        (
            depth === largestDepth &&
            (
                largestTreeRoot === "" ||
                root < largestTreeRoot
            )
        )
    ) {
        largestDepth = depth;
        largestTreeRoot = root;
    }

    hierarchies.push({
        root,
        tree,
        depth
    });
}

return {

    user_id: "Anuj_12112005",

    email_id: "anuj0375.be23@chitkara.edu.in",

    college_roll_number: "2310990375",

    hierarchies,

    invalid_entries,

    duplicate_edges,

    summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot
    }

};


}
    module.exports = {
    processHierarchy
};