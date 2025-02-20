import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const stats = [
    {title: "Users", value: "1,250", growth: "+15%"},
    {title: "Revenue", value: "$45,000", growth: "+8%"},
    {title: "Orders", value: "320", growth: "+5%"},
];

export default function Stats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader>
                        <CardTitle>{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-500">{stat.growth}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}