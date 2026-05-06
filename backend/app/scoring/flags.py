from dataclasses import dataclass


@dataclass
class Flag:
    severity: str  # "high" | "med" | "low"
    text: str
    category: str = ""

    def to_dict(self) -> dict:
        return {"severity": self.severity, "text": self.text, "category": self.category}
