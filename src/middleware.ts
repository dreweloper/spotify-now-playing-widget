import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const middleware = (req: NextRequest) => {
	const token = req.headers.get("X-Access-Token");

	if (!token) {
		return NextResponse.json({ message: "No token provided" }, { status: 401 });
	}

	return NextResponse.next();
};

export const config = {
	matcher: ["/api/spotify/:path*"]
};

export default middleware;
