'use client';

import type { ReactNode } from 'react';

type ResponseFieldNameProps = {
  name: string;
};

const canBreakBetween = (current: string, next: string | undefined) => {
  if (!next) {
    return false;
  }

  if (current === '.' || current === '_' || current === '-') {
    return true;
  }

  return /[a-z0-9]/.test(current) && /[A-Z]/.test(next);
};

export function ResponseFieldName({ name }: ResponseFieldNameProps) {
  const parts: ReactNode[] = [];

  for (let index = 0; index < name.length; index += 1) {
    const current = name[index];
    const next = name[index + 1];

    parts.push(current);

    if (canBreakBetween(current, next)) {
      parts.push(<wbr key={`${name}-${index}`} />);
    }
  }

  return <span className="response-field-card__name">{parts}</span>;
}
