d3.json('data.json').then(data => {
    d3.json('data.json').then(data => {
        const treeData = buildTree(data);

        const margin = { top: 20, right: 90, bottom: 30, left: 90 },
            width = 1800 - margin.left - margin.right,
        height = 8000 - margin.top - margin.bottom;

        const svg = d3.select("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const root = d3.hierarchy(treeData, d => d.children);

        const treeLayout = d3.tree().size([height, width]); // Adjusted for left-to-right layout

        treeLayout(root);

        const link = svg.selectAll(".link")
            .data(root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d3.linkHorizontal() // Use d3.linkHorizontal() for left-to-right layout
                .x(d => d.y)
                .y(d => d.x));

        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
            .attr("transform", d => "translate(" + d.y + "," + d.x + ")"); // Adjusted for left-to-right layout

        node.append("circle")
            .attr("r", 10);

        node.append("text")
            .attr("dy", "-1.2em")
            .attr("x", 0)
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .text(d => d.data.name);
    });

    function buildTree(paths) {
        let root = { name: "root", children: [] };

        paths.forEach(path => {
            const parts = path.split('/').filter(part => part !== "");
            let currentLevel = root;

            parts.forEach(part => {
                let existingPath = currentLevel.children.find(child => child.name === part);

                if (!existingPath) {
                    existingPath = { name: part, children: [] };
                    currentLevel.children.push(existingPath);
                }

                currentLevel = existingPath;
            });
        });

        return root;
    }
});

function buildTree(paths) {
    let root = { name: "root", children: [] };

    paths.forEach(path => {
        const parts = path.split('/').filter(part => part !== "");
        let currentLevel = root;

        parts.forEach(part => {
            let existingPath = currentLevel.children.find(child => child.name === part);

            if (!existingPath) {
                existingPath = { name: part, children: [] };
                currentLevel.children.push(existingPath);
            }

            currentLevel = existingPath;
        });
    });

    return root;
}
